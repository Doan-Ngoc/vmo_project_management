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
    await this.userService.updateAccountStatus(
      AccountStatus.EMAIL_SEND_FAILED,
      job.data.id,
    );
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
  }
}
