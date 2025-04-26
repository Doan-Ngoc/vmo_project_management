import { Controller, Post, Body, Query, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLogInDto } from './dto';
import { Response } from 'express';
import { join } from 'path';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  logIn(@Body() authLogInDto: AuthLogInDto) {
    return this.authService.logIn(authLogInDto);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    await this.authService.verifyEmail(token);
    return { message: 'Email verified successfully' };
  }
}
