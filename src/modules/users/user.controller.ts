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
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './services/user.service';
// import { CreateUserDto } from './dtos/create-user.dto';
import { CreateUserDto } from './dtos';
import { Auth } from '@/decorators/auth.decorator';
import { Permissions } from '@/enum/permissions.enum';
import { EmailService } from '../emails/services/email.service';
import { FileService } from '../files/services/file.service';
import { User } from './entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseStorageService } from '../../infrastructure/firebase/services/firebase.storage.service';
import * as multer from 'multer';
import { extname } from 'path';
import { CreateUserResponseDto } from './dtos/create-user-response.dto';
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService,
    private readonly storageService: FirebaseStorageService,
  ) {}
  @Post()
  createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
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

  @Post('profile-picture')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Body('userId') userId: string,
  ) {
    return this.storageService.uploadProfilePicture(file, userId);
  }
}
