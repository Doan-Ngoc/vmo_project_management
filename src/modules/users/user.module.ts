import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/modules/auth/auth.module';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { RoleModule } from '../roles/role.module';
import { WorkingUnitModule } from '../working-units/working-unit.module';
import { CreateUserDto } from './dtos';
import { JwtModule } from '../jwt/jwt.module';
import { PermissionModule } from '../permissions/permission.module';
import { MailModule } from '../mails/mail.module';
import { FilesModule } from '../files/file.module';
import { MulterModule } from '@nestjs/platform-express';
import { FirebaseModule } from '../firebase/firebase.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    forwardRef(() => RoleModule),
    forwardRef(() => PermissionModule),
    WorkingUnitModule,
    JwtModule,
    MailModule,
    FilesModule,
    MulterModule.register({
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
      },
    }),
    FirebaseModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
