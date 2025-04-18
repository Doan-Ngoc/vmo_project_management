import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './services/email.service';
import * as path from 'path';
import { JwtModule } from '../jwt/jwt.module';
import { EmailController } from './email.controller';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule, JwtModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST'),
          port: configService.get('MAIL_PORT'),
          secure: configService.get('MAIL_SECURE') === 'true',
          auth: {
            user: configService.get('MAIL_USER'),
            pass: configService.get('MAIL_PASS'),
          },
        },
        defaults: {
          from: `"Project Management System" <${configService.get('MAIL_FROM')}>`,
        },
        template: {
          // dir: __dirname + '/templates',
          dir: 'src/modules/emails/templates',
          // dir: path.join(process.cwd(), 'src/modules/mail/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    JwtModule,
  ],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
