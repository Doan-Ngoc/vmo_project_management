import {
  Processor,
  Process,
  OnQueueFailed,
  OnQueueCompleted,
} from '@nestjs/bull';
import { Job } from 'bull';
import { EmailService } from '../../emails/services/email.service';
import { CreateVerificationEmailDto } from '../../emails/dtos/create-verification-email.dto';
import { forwardRef, Inject, Logger } from '@nestjs/common';
import { UserService } from '../../users/services/user.service';
// import { AccountStatus } from '@/enum/account-status.enum';
import { AccountStatus } from '../../../enum/account-status.enum';

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);
  constructor(
    @Inject(forwardRef(() => EmailService))
    private readonly emailService: EmailService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  @Process('send-verification-email')
  async handleSendVerificationEmail(job: Job<CreateVerificationEmailDto>) {
    try {
      this.logger.debug(`Processing email job ${job.id} for ${job.data.email}`);
      const user = await this.userService.getById(job.data.id);
      this.logger.debug(
        `Current user status before sending email: ${user.accountStatus}`,
      );

      await this.emailService.sendVerificationEmail(job.data);
    } catch (error) {
      this.logger.error(
        `Failed to send email for job ${job.id}: ${error.message}`,
      );
      throw error;
    }
  }

  @OnQueueFailed()
  async onFailed(job: Job, error: Error) {
    this.logger.error(
      `Job ${job.id} failed after ${job.attemptsMade} attempts: ${error.message}`,
    );
    const maxAttempts = job.opts.attempts ?? 1;
    const currentAttempt = job.attemptsMade + 1; // attemptsMade is zero-based

    if (currentAttempt > maxAttempts) {
      // Only run this on the final failure
      console.log(`Final failure after ${maxAttempts} attempts`, error);
      await this.userService.updateAccountStatus(
        AccountStatus.EMAIL_SEND_FAILED,
        job.data.id,
      );
      this.logger.debug(`Updated user status to EMAIL_SEND_FAILED`);
    }
  }

  @OnQueueCompleted()
  async onCompleted(job: Job) {
    this.logger.debug(
      `Successfully completed job ${job.id} for ${job.data.email}`,
    );

    await this.userService.updateAccountStatus(
      AccountStatus.PENDING_ACTIVATION,
      job.data.id,
    );
    this.logger.debug(`Updated user status to PENDING_ACTIVATION`);
  }
}
