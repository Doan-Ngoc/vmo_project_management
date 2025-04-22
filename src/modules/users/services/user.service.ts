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
import { AuthService } from '../../auth/auth.service';
import { UserRepository } from '../repositories/user.repository';
import { AccountStatus } from '../../../enum/account-status.enum';
import { AccountType } from '../../../enum/account-type.enum';
import { RoleService } from '../../roles/services/role.service';
import { WorkingUnitService } from '../../working-units/services/working-unit.service';
import { Auth } from '@/decorators/auth.decorator';
import { CreateUserDto } from '../dtos';
import { EmailService } from '../../emails/services/email.service';
import { JwtService } from '../../jwt/services/jwt.service';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { FirebaseStorageService } from '../../../infrastructure/firebase/services/firebase.storage.service';
import { extname } from 'path';
import { QueueService } from '../../queue/services/queue.service';
import { CreateUserResponseDto } from '../dtos/create-user-response.dto';
import { generateRandomPassword } from '../../../utils/password-generator.util';

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

  // async createUser(
  //   createUserDto: CreateUserDto,
  // ): Promise<CreateUserResponseDto> {
  //   const { password, roleId, workingUnitId, ...createUserData } =
  //     createUserDto;
  //   const hashedPassword = this.authService.hashPassword(password);
  //   const role = await this.roleService.getById(roleId);
  //   const workingUnit = await this.workingUnitService.getById(workingUnitId);

  //   const userData = {
  //     ...createUserData,
  //     username: createUserDto.email,
  //     role,
  //     workingUnit,
  //     hashedPassword,
  //     accountStatus: AccountStatus.PENDING,
  //     accountType: AccountType.MEMBER,
  //   };

  //   // Create user
  //   try {
  //     const newUser = this.userRepository.create(userData);
  //     const savedUser = await this.userRepository.save(newUser);

  //     // Create response DTO
  //     const sentBackData: CreateUserResponseDto = {
  //       id: savedUser.id,
  //       email: savedUser.email,
  //       employeeName: savedUser.employeeName,
  //       username: savedUser.username,
  //       roleId: savedUser.role.id,
  //       workingUnitId: savedUser.workingUnit.id,
  //       temporaryPassword: password,
  //     };
  //     return sentBackData;
  //   } catch (error) {
  //     if (error.code === '23505') {
  //       throw new ConflictException('Email already exists');
  //     }
  //     throw new BadRequestException(error.message || 'Failed to create user');
  //   }
  // }

  async createBulkUsers(newUserDataArray: CreateUserDto[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const createdUsers: CreateUserResponseDto[] = [];
    const errors: string[] = [];

    const roles = await this.roleService.getAll();
    const roleNames = roles.map((role) => role.name);
    const workingUnits = await this.workingUnitService.getAll();
    const workingUnitNames = workingUnits.map(
      (workingUnit) => workingUnit.name,
    );
    // console.log(newUserDataArray);
    for (let rowIndex = 0; rowIndex < newUserDataArray.length; rowIndex++) {
      const row = newUserDataArray[rowIndex];
      const rowNumber = rowIndex + 1;

      const inputRole = row.role.toLowerCase();
      const role = roles.find((role) => role.name === inputRole);
      if (!role) {
        errors.push(
          `Role at row ${rowNumber} not found in the system: ${row.role}`,
        );
      }

      const inputWorkingUnit = row.workingUnit.toLowerCase();
      const workingUnit = workingUnits.find(
        (workingUnit) => workingUnit.name === inputWorkingUnit,
      );
      if (!workingUnit) {
        errors.push(
          `Working Unit at row ${rowNumber} not found in the system: ${row.workingUnit}`,
        );
      }

      if (!role || !workingUnit) {
        continue;
      }

      try {
        //Generate password
        const password = generateRandomPassword();
        const hashedPassword = this.authService.hashPassword(password);

        const userData = {
          email: row.email,
          username: row.email,
          employeeName: row.employeeName,
          role,
          workingUnit,
          hashedPassword,
          accountType: AccountType.MEMBER,
        };

        if (userData.email === 'hokanohito1234@gmail.com') {
          errors.push(`Error at row ${rowNumber}: This is a test error`);
        }
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
        errors.push(`Error at row ${rowNumber}: ${error.message}`);
      }
    }

    if (errors.length > 0) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException({
        message: 'Bulk user creation failed',
        errors: errors,
      });
    }

    await queryRunner.commitTransaction();

    return {
      message: 'Bulk user creation completed',
      createdUsers: createdUsers,
    };

    await queryRunner.release();
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

  async saveProfilePictureToDatabase(url: string, userId: string) {
    const user = await this.getById(userId);
    user.profilePicture = url;
    await this.userRepository.save(user);
  }

  // async uploadProfilePicture(file: Express.Multer.File, userId: string) {
  //   try {
  //     const filePath = `users/profile-picture/${userId}${extname(file.originalname)}`;

  //     return this.storageService.uploadFile(file.buffer, filePath, {
  //       contentType: file.mimetype,
  //       metadata: {
  //         userId,
  //         originalName: file.originalname,
  //       },
  //     });
  //   } catch (error) {
  //     throw new BadRequestException(
  //       'Failed to upload profile picture: ' + error.message,
  //     );
  //   }
  // }
}
