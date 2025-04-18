import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('signup') private readonly signupQueue: Queue) {}

  async addSignupJob(data: {
    email: string;
    verificationToken: string;
    username: string;
    password: string;
  }) {
    return this.signupQueue.add('send-verification-email', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
  }
}
