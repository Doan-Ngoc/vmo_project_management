import {
  Injectable,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthLogInDto } from './dto/authLogIn.dto';
import { UserService } from '../users/services/user.service';
import { JwtService } from '../jwt/services/jwt.service';
import { ConfigService } from '@nestjs/config';
import { AccountStatus } from '../../enum/account-status.enum';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  hashPassword(password: string) {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
  }

  comparePassword(receivedPassword: string, hashedPassword: string) {
    return bcrypt.compare(receivedPassword, hashedPassword);
  }

  async logIn(authLogInDto: AuthLogInDto) {
    const { username, password } = authLogInDto;
    const user = await this.userService.getUserByUserName(username);
    const checkPassword = await this.comparePassword(
      password,
      user.hashedPassword,
    );
    if (user.accountStatus !== AccountStatus.ACTIVE) {
      throw new BadRequestException('Your account is not active');
    }
    if (!checkPassword) throw new BadRequestException('Password incorrect');

    return {
      accessToken: this.jwtService.sign(
        {
          id: user.id,
          ...(user.role && { roleId: user.role.id }),
          accountType: user.accountType,
        },
        this.configService.get('JWT_ACCESS_KEY') as string,
        {
          expiresIn: this.configService.get('JWT_ACCESS_EXPIRE'),
        },
      ),
    };
  }

  async verifyEmail(token: string) {
    const decoded = this.jwtService.verify(
      token,
      this.configService.get('JWT_VERIFICATION_KEY') as string,
    );
    await this.userService.updateAccountStatus(
      AccountStatus.ACTIVE,
      decoded.id,
    );
  }
}
