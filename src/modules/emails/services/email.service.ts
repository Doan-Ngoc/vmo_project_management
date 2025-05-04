import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '../../jwt/services/jwt.service';
import { CreateVerificationEmailDto } from '../dtos';

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
    const { id, email, username, temporaryPassword } = userData;

    const verificationToken = this.jwtService.sign(
      { id },
      this.configService.getOrThrow('JWT_VERIFICATION_KEY') as string,
      { expiresIn: this.configService.getOrThrow('JWT_VERIFICATION_EXPIRE') },
    );

    const verificationUrl = `${this.configService.getOrThrow('SITE_URL')}/auth/verify-email?token=${verificationToken}`;

    if (email === 'minhngocd3112@gmail.com') {
      throw new BadRequestException('Testing failed email');
    }
    await this.mailerService.sendMail({
      to: email,
      subject: 'Please verify your account',
      template: 'verify-email',
      context: {
        verificationUrl,
        username,
        temporaryPassword,
      },
    });
  }
}
