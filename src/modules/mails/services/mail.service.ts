import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '../../jwt/services/jwt.service';
@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendVerificationEmail(
    email: string,
    verificationToken: string,
    username: string,
    password: string,
  ): Promise<void> {
    try {
      const verificationUrl = `${this.configService.get('SITE_URL')}/auth/verify-email?token=${verificationToken}`;

      if (email === 'hokanohito1234@gmail.com') {
        throw new BadRequestException('Email is not valid');
      }
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
      throw new BadRequestException('Failed to send verification email');
    }
  }
}
