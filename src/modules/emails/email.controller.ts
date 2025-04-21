import {
  Controller,
  Post,
  Body,
  Inject,
  forwardRef,
  BadRequestException,
} from '@nestjs/common';
import { EmailService } from './services/email.service';
import { CreateVerificationEmailDto } from './dtos/create-verification-email.dto';
import { QueueService } from '../queue/services/queue.service';
@Controller('emails')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    @Inject(forwardRef(() => QueueService))
    private readonly queueService: QueueService,
  ) {}
  @Post('bulk')
  async sendBulkEmail(
    @Body() createVerificationEmailDtos: CreateVerificationEmailDto[],
  ) {
    // try {
    await Promise.all(
      createVerificationEmailDtos.map((dto) =>
        this.queueService.addSendingEmailJob(dto),
      ),
    );
    return {
      message: 'Emails queued for sending',
      totalEmails: createVerificationEmailDtos.length,
    };
    // } catch (error) {
    //   throw new BadRequestException('Failed to queue emails: ' + error.message);
    // }
  }
}
