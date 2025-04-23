import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { CreateVerificationEmailDto } from '@/modules/emails/dtos/create-verification-email.dto';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('email') private readonly emailQueue: Queue) {}

  async addSendingEmailJob(data: CreateVerificationEmailDto) {
    try {
      const job = await this.emailQueue.add('send-verification-email', data, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      });
      return job;
    } catch (error) {
      throw new Error(`Failed to add email job to queue: ${error.message}`);
    }
  }
}
