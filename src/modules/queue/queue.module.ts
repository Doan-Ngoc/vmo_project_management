import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailProcessor } from './processors/email.processor';
import { QueueService } from './services/queue.service';
import { EmailModule } from '../emails/email.module';
import { UserModule } from '../users/user.module';
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'email',
    }),
    forwardRef(() => EmailModule),
    forwardRef(() => UserModule),
  ],
  providers: [EmailProcessor, QueueService],
  exports: [QueueService],
})
export class QueueModule {}
