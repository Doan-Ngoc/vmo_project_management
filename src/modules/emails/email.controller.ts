import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { CreateVerificationEmailDto } from './dtos/create-verification-email.dto';
@Controller('emails')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
  @Post('bulk')
  async sendBulkEmail(
    @Body() createVerificationEmailDto: CreateVerificationEmailDto[],
  ) {
    return this.emailService.sendBulk(createVerificationEmailDto);
  }
}
