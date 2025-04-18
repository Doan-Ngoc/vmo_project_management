import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from '../../mails/services/mail.service';

@Processor('signup')
export class SignupProcessor {
  constructor(private readonly mailService: MailService) {}

  @Process('send-verification-email')
  async handleSendVerificationEmail(job: Job) {
    const { email, verificationToken, username, password } = job.data;

    try {
      await this.mailService.sendVerificationEmail(
        email,
        verificationToken,
        username,
        password,
      );
      return { success: true };
    } catch (error) {
      throw error;
    }
  }
}
