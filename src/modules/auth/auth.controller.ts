import { Controller, Post, Body, Query, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLogInDto } from './dto/authLogIn.dto';

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
}
