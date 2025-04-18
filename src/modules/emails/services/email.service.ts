import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '../../jwt/services/jwt.service';
import { CreateVerificationEmailDto } from '../dtos/create-verification-email.dto';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async sendVerificationEmail(
    userData: CreateVerificationEmailDto,
  ): Promise<void> {
    const { id, email, username, password } = userData;
    const verificationToken = this.jwtService.sign(
      { id },
      this.configService.get('JWT_VERIFICATION_KEY') as string,
      { expiresIn: this.configService.get('JWT_VERIFICATION_EXPIRE') },
    );

    try {
      const verificationUrl = `${this.configService.get('SITE_URL')}/auth/verify-email?token=${verificationToken}`;

      // if (email === 'hokanohito1234@gmail.com') {
      //   throw new BadRequestException('Email is not valid');
      // }
      await this.mailerService.sendMail({
        to: email,
        subject: 'Please verify your account',
        template: 'verify-email',
        context: {
          verificationUrl,
          username,
          password,
        },
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Failed to send verification email', error);
    }
  }

  async sendBulk(userDataArray: CreateVerificationEmailDto[]) {
    for (const user of userDataArray) {
      await this.sendVerificationEmail(user);
    }
  }
}
