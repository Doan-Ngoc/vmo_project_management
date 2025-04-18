import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailService } from '../../emails/services/email.service';

@Processor('signup')
export class SignupProcessor {
  constructor(private readonly emailService: EmailService) {}

  @Process('send-verification-email')
  async handleSendVerificationEmail(job: Job) {
    // const { email, verificationToken, username, password } = job.data;
    // try {
    //   await this.emailService.sendVerificationEmail(
    //     email,
    //     verificationToken,
    //     username,
    //     password,
    //   );
    //   return { success: true };
    // } catch (error) {
    //   throw error;
    // }
  }
}
