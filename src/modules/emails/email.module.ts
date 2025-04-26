import { Module, forwardRef } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './services/email.service';
import * as path from 'path';
import { JwtModule } from '../jwt/jwt.module';
import { EmailController } from './email.controller';
import { QueueModule } from '../queue/queue.module';
import { PermissionModule } from '../permissions/permission.module';
import { UserModule } from '../users/user.module';
@Module({
  imports: [
    ConfigModule,
    JwtModule,
    forwardRef(() => QueueModule),
    forwardRef(() => PermissionModule),
    forwardRef(() => UserModule),
    MailerModule.forRootAsync({
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
          dir: path.join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
