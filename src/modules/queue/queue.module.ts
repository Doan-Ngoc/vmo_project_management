import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SignupProcessor } from './processors/signup.processor';
import { QueueService } from './services/queue.service';
import { EmailModule } from '../emails/email.module';
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'signup',
    }),
    EmailModule,
  ],
  providers: [SignupProcessor, QueueService],
  exports: [QueueService],
})
export class QueueModule {}
