import { Processor, Process, OnQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailService } from '../../emails/services/email.service';
import { CreateVerificationEmailDto } from '../../emails/dtos/create-verification-email.dto';
import { forwardRef, Inject, Logger } from '@nestjs/common';

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);
  constructor(
    @Inject(forwardRef(() => EmailService))
    private readonly emailService: EmailService,
  ) {}

  @Process('send-verification-email')
  async handleSendVerificationEmail(job: Job<CreateVerificationEmailDto>) {
    try {
      console.log('handleSendVerificationEmail');
      this.logger.debug(`Processing email job ${job.id} for ${job.data.email}`);
      await this.emailService.sendVerificationEmail(job.data);
      this.logger.debug(`Successfully sent email for job ${job.id}`);
      return { success: true, email: job.data.email };
    } catch (error) {
      this.logger.error(
        `Failed to send email for job ${job.id}: ${error.message}`,
      );
      throw error;
    }
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error) {
    this.logger.error(
      `Job ${job.id} failed after ${job.attemptsMade} attempts: ${error.message}`,
    );
    //Add notification logic for failed jobs
  }
}
