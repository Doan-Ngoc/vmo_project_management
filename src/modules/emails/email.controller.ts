import { Controller, Post, Body, Inject, forwardRef } from '@nestjs/common';
import { CreateVerificationEmailDto } from './dtos/create-verification-email.dto';
import { QueueService } from '../queue/services/queue.service';
import { Auth } from '../../decorators/auth.decorator';
import { Permissions } from '../../enum/permissions.enum';
@Controller('emails')
export class EmailController {
  constructor(
    @Inject(forwardRef(() => QueueService))
    private readonly queueService: QueueService,
  ) {}
  @Post()
  @Auth(Permissions.SEND_BULK_EMAIL)
  async sendBulkEmail(
    @Body() createVerificationEmailDtos: CreateVerificationEmailDto[],
  ) {
    await Promise.all(
      createVerificationEmailDtos.map((dto) =>
        this.queueService.addSendingEmailJob(dto),
      ),
    );
    return {
      message: 'Emails queued for sending',
      totalEmails: createVerificationEmailDtos.length,
    };
  }
}
