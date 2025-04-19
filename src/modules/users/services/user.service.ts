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
import { EmailService } from '../../emails/services/email.service';
import { JwtService } from '../../jwt/services/jwt.service';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { FirebaseStorageService } from '@/modules/firebase/firebase.storage.service';
import { extname } from 'path';
import { QueueService } from '../../queue/services/queue.service';
import { CreateUserResponseDto } from '../dtos/create-user-response.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private readonly userRepository: UserRepository,
    private readonly roleService: RoleService,
    private readonly workingUnitService: WorkingUnitService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
    private readonly storageService: FirebaseStorageService,
    private readonly queueService: QueueService,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
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
    try {
      const newUser = this.userRepository.create(userData);
      const savedUser = await this.userRepository.save(newUser);

      // Create response DT,O
      const sentBackData: CreateUserResponseDto = {
        id: savedUser.id,
        email: savedUser.email,
        employeeName: savedUser.employeeName,
        username: savedUser.username,
        roleId: savedUser.role.id,
        workingUnitId: savedUser.workingUnit.id,
        temporaryPassword: password,
      };
      return sentBackData;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email already exists');
      }
      throw new BadRequestException(error.message || 'Failed to create user');
    }
  }

  async createBulkUsers(newUserDataArray: CreateUserDto[]) {
    // const queryRunner = this.dataSource.createQueryRunner();
    // await queryRunner.connect();
    // await queryRunner.startTransaction();

    const createdUsers: CreateUserResponseDto[] = [];
    const errors: { email: string; error: string }[] = [];

    for (const createUserDto of newUserDataArray) {
      try {
        const { password, roleId, workingUnitId, ...createUserData } =
          createUserDto;
        if (createUserDto.email === 'hokanohito1234@gmail.com') {
          throw new Error('This is a test error');
        }
        const hashedPassword = this.authService.hashPassword(password);
        const role = await this.roleService.getById(roleId);
        const workingUnit =
          await this.workingUnitService.getById(workingUnitId);

        const userData = {
          ...createUserData,
          username: createUserDto.email,
          role,
          workingUnit,
          hashedPassword,
          accountStatus: AccountStatus.PENDING,
          accountType: AccountType.MEMBER,
        };

        const newUser = this.userRepository.create(userData);
        const savedUser = await this.userRepository.save(newUser);
        const sentBackData: CreateUserResponseDto = {
          id: savedUser.id,
          email: savedUser.email,
          employeeName: savedUser.employeeName,
          username: savedUser.username,
          temporaryPassword: password,
          roleId: savedUser.role.id,
          workingUnitId: savedUser.workingUnit.id,
        };
        createdUsers.push(sentBackData);
      } catch (error) {
        errors.push({
          email: createUserDto.email,
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

  // await queryRunner.commitTransaction();

  // // Queue email sending for successful users
  // for (const user of createdUsers) {
  //   const verificationToken = this.jwtService.sign(
  //     { id: user.id },
  //     this.configService.get('JWT_VERIFICATION_KEY') as string,
  //     { expiresIn: this.configService.get('JWT_VERIFICATION_EXPIRE') },
  //   );

  //   await this.queueService.addSignupJob({
  //     email: user.email,
  //     verificationToken,
  //     username: user.username,
  //     password: createUserDto.password,
  //   });
  // }
  //   catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     throw new BadRequestException(error.message || 'Failed to create users');
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

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
      return this.storageService.uploadFile(file.buffer, filePath, {
        contentType: file.mimetype,
        metadata: {
          userId,
          originalName: file.originalname,
        },
      });

      // Get the download URL
      // const downloadUrl = await this.storageService.getDownloadUrl(filePath);

      // return {
      //   message: 'Profile picture uploaded successfully',
      //   downloadUrl,
      // };
    } catch (error) {
      throw new BadRequestException(
        'Failed to upload profile picture: ' + error.message,
      );
    }
  }
}
