import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { CreateVerificationEmailDto } from '@/modules/emails/dtos/create-verification-email.dto';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('email') private readonly emailQueue: Queue) {}

  async addSendingEmailJob(data: CreateVerificationEmailDto) {
    try {
      return this.emailQueue.add('send-verification-email', data, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      });
    } catch (error) {
      console.log('error', error);
      // throw error;
    }
  }
}
