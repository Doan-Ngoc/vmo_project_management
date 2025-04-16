import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '../../jwt/services/jwt.service';
@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationEmail(
    email: string,
    verificationToken: string,
    username: string,
    password: string,
  ): Promise<void> {
    const verificationUrl = `http://localhost:3000/auth/verify-email?token=${verificationToken}`;

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
  }
}
