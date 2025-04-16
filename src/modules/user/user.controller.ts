import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { UserService } from './services/user.service';
// import { CreateUserDto } from './dtos/create-user.dto';
import { CreateUserDto } from './dtos';
import { Auth } from '@/decorators/auth.decorator';
import { Permissions } from '@/enum/permissions.enum';
import { MailService } from '../mail/services/mail.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Auth(Permissions.CREATE_CLIENT)
  @Get()
  getUsers() {
    return 'abc';
  }

  // @Get('test-email')
  // async testEmail(@Query('email') email: string) {
  //   await this.mailService.sendVerificationEmail(email, 'test-token-123');
  //   return { message: 'Email sent successfully' };
  // }
}
