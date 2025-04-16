import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UploadedFile,
  UseInterceptors,
  FileTypeValidator,
  ParseFilePipe,
} from '@nestjs/common';
import { UserService } from './services/user.service';
// import { CreateUserDto } from './dtos/create-user.dto';
import { CreateUserDto } from './dtos';
import { Auth } from '@/decorators/auth.decorator';
import { Permissions } from '@/enum/permissions.enum';
import { MailService } from '../mail/services/mail.service';
import { FileService } from '../files/services/file.service';
import { User } from './entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly fileService: FileService,
  ) {}
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('bulk')
  @UseInterceptors(FileInterceptor('file'))
  async createBulkUsers(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const userDataArray = await this.fileService.processExcelImport(file);
    return this.userService.createBulkUsers(userDataArray);
  }
  // @Post('bulk')
  // createBulkUsers(@Body() newUserDataArray: CreateUserDto[]) {
  //   return this.userService.createBulkUsers(newUserDataArray);
  // }

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
