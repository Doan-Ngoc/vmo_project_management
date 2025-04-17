import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
// import { CreateUserDto } from '../dtos';
import { User } from '../entities/user.entity';
import { AuthService } from 'src/modules/auth/auth.service';
import { UserRepository } from '../repositories/user.repository';
import { AccountStatus } from 'src/enum/account-status.enum';
import { AccountType } from 'src/enum/account-type.enum';
import { RoleService } from '../../roles/services/role.service';
import { WorkingUnitService } from '../../working-units/services/working-unit.service';
import { Auth } from '@/decorators/auth.decorator';
import { CreateUserDto } from '../dtos';
import { MailService } from '../../mails/services/mail.service';
import { JwtService } from '../../jwt/services/jwt.service';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { FirebaseStorageService } from '@/modules/firebase/firebase.storage.service';
import { extname } from 'path';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private readonly userRepository: UserRepository,
    private readonly roleService: RoleService,
    private readonly workingUnitService: WorkingUnitService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
    private readonly storageService: FirebaseStorageService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { password, roleId, workingUnitId, ...createUserData } =
        createUserDto;
      const hashedPassword = this.authService.hashPassword(password);
      const role = await this.roleService.getById(roleId);
      const workingUnit = await this.workingUnitService.getById(workingUnitId);

      const userData = {
        ...createUserData,
        username: createUserDto.email,
        role,
        workingUnit,
        hashedPassword,
        accountStatus: AccountStatus.PENDING,
        accountType: AccountType.MEMBER,
      };

      // Create user
      const newUser = this.userRepository.create(userData);
      const savedUser = await queryRunner.manager.save(newUser);

      // Generate verification token
      const verificationToken = this.jwtService.sign(
        { id: savedUser.id },
        this.configService.get('JWT_VERIFICATION_KEY') as string,
        { expiresIn: this.configService.get('JWT_VERIFICATION_EXPIRE') },
      );

      // Send verification email
      await this.mailService.sendVerificationEmail(
        savedUser.email,
        verificationToken,
        savedUser.username,
        password,
      );

      await queryRunner.commitTransaction();
      return User.plainToClass(savedUser);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error.code === '23505') {
        throw new ConflictException('Email already exists');
      }
      throw new BadRequestException(error.message || 'Failed to create user');
    } finally {
      await queryRunner.release();
    }
  }

  async createBulkUsers(newUserDataArray: CreateUserDto[]) {
    const createdUsers: User[] = [];
    const errors: { email: string; error: string }[] = [];

    for (const userData of newUserDataArray) {
      try {
        const user = await this.createUser(userData);
        createdUsers.push(user);
      } catch (error) {
        errors.push({
          email: userData.email,
          error: error.message,
        });
      }
    }

    return {
      message: 'Bulk user creation completed',
      summary: {
        total: newUserDataArray.length,
        successful: createdUsers.length,
        failed: errors.length,
      },
      createdUsers: createdUsers,
      failedUsers: errors,
    };
  }

  async getById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role', 'workingUnit'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async getUserByUserName(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['role'],
    });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  async updateAccountStatus(
    status: AccountStatus,
    userId: string,
  ): Promise<void> {
    // const result = await this.userRepository.update(userId, {
    //   accountStatus: status,
    // });
    const user = await this.getById(userId);
    if (user.accountStatus === status) {
      throw new BadRequestException('User already has this status');
    }
    user.accountStatus = status;
    await this.userRepository.save(user);
  }

  async uploadProfilePicture(file: Express.Multer.File, userId: string) {
    try {
      // Create a path for the profile picture in Firebase Storage
      const filePath = `users/profile-picture/${userId}${extname(file.originalname)}`;

      // Upload the file to Firebase Storage
      await this.storageService.uploadFile(file.buffer, filePath, {
        contentType: file.mimetype,
        metadata: {
          userId,
          originalName: file.originalname,
        },
      });

      // Get the download URL
      const downloadUrl = await this.storageService.getDownloadUrl(filePath);

      return {
        message: 'Profile picture uploaded successfully',
        downloadUrl,
      };
    } catch (error) {
      throw new BadRequestException(
        'Failed to upload profile picture: ' + error.message,
      );
    }
  }
}
