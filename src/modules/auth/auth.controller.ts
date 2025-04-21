import {
  Controller,
  Post,
  Body,
  Query,
  Get,
  Header,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLogInDto } from './dto/authLogIn.dto';
import { Response } from 'express';
import { join } from 'path';
import { createReadStream, existsSync } from 'fs';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  logIn(@Body() authLogInDto: AuthLogInDto) {
    return this.authService.logIn(authLogInDto);
  }

  @Post('verify-email')
  async verifyEmail(@Query('token') token: string) {
    await this.authService.verifyEmail(token);
    return { message: 'Email verified successfully' };
  }

  @Get('download-template')
  async downloadTemplate(@Res() res: Response) {
    const templatePath = join(
      process.cwd(),
      'src/shared/file-processing/templates/user-import-template.xlsx',
    );
    res.sendFile(templatePath);
  }
}
