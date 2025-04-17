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
import { MailService } from '../mail/services/mail.service';
import { FileService } from '../files/services/file.service';
import { User } from './entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseStorageService } from '../firebase/firebase.storage.service';
import * as multer from 'multer';
import { extname } from 'path';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly fileService: FileService,
    private readonly storageService: FirebaseStorageService,
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

  @Post('profile-picture')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  async uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Body('userId') userId: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    try {
      // Create a path for the profile picture in Firebase Storage
      const filePath = `users/${userId}/profile-picture${extname(file.originalname)}`;

      // Upload the file to Firebase Storage
      await this.storageService.uploadFile(file.buffer, filePath, {
        contentType: file.mimetype,
        metadata: {
          userId,
          originalName: file.originalname,
        },
      });

      // Get the download URL
      const downloadUrl = await this.storageService.getDownloadUrl(filePath);

      return {
        message: 'Profile picture uploaded successfully',
        downloadUrl,
      };
    } catch (error) {
      throw new BadRequestException(
        'Failed to upload profile picture: ' + error.message,
      );
    }
  }
}
