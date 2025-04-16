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
import { RoleService } from '../../role/services/role.service';
import { WorkingUnitService } from '../../working-unit/services/working-unit.service';
import { Auth } from '@/decorators/auth.decorator';
import { CreateUserDto } from '../dtos';
import { MailService } from '../../mail/services/mail.service';
import { JwtService } from '../../jwt/services/jwt.service';
import { ConfigService } from '@nestjs/config';

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
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
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
    try {
      const newUser = this.userRepository.create(userData);
      const savedUser = await this.userRepository.save(newUser);
      console.log('came here');
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
      );

      return User.plainToClass(savedUser);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email already exists');
      }
      console.log(error);
      throw new BadRequestException();
    }
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
}
