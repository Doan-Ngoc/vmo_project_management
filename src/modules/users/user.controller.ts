import {
  Controller,
  Post,
  Body,
  Get,
  UploadedFile,
  UseInterceptors,
  FileTypeValidator,
  ParseFilePipe,
  BadRequestException,
  Param,
  Put,
  Patch,
} from '@nestjs/common';
import { UserService } from './services/user.service';
import { Auth } from '../../decorators/auth.decorator';
import { Permissions } from '../../enum/permissions.enum';
import { FileService } from './services/file.service';
import { User } from './entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseStorageService } from '../../infrastructure/firebase/services/firebase.storage.service';
import * as multer from 'multer';
import { AccountStatus } from '../../enum/account-status.enum';
import { GetUser } from '../../decorators/get-user.decorator';
import { join } from 'path';
import { Response } from 'express';
import { Res } from '@nestjs/common';
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService,
    private readonly storageService: FirebaseStorageService,
  ) {}

  @Get(':id')
  @Auth(Permissions.GET_USER_BY_ID)
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.getById(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @Auth(Permissions.CREATE_USERS)
  async createUsers(
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
    return this.userService.create(userDataArray);
  }

  @Get('download/user-import-template')
  async downloadTemplate(@Res() res: Response) {
    const templatePath = join(
      process.cwd(),
      'src/templates/user-import-template.xlsx',
    );
    res.sendFile(templatePath);
  }

  @Patch('/password')
  @Auth(Permissions.CHANGE_PASSWORD)
  async changePassword(
    @Body('newPassword') newPassword: string,
    @GetUser() user: User,
  ) {
    return this.userService.changePassword(newPassword, user.id);
  }

  @Patch('/:id')
  @Auth(Permissions.UPDATE_ACCOUNT_STATUS)
  async updateUser(
    @Param('id') id: string,
    @Body('accountStatus') accountStatus: AccountStatus,
  ): Promise<User> {
    return this.userService.updateAccountStatus(accountStatus, id);
  }

  @Post('profile-picture')
  @Auth(Permissions.UPLOAD_PROFILE_PICTURE)
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
