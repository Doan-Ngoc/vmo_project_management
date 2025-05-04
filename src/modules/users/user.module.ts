import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../../modules/auth/auth.module';
import { UserRepository } from './repositories/user.repository';
import { RoleModule } from '../roles/role.module';
import { WorkingUnitModule } from '../working-units/working-unit.module';
import { JwtModule } from '../jwt/jwt.module';
import { PermissionModule } from '../permissions/permission.module';
import { EmailModule } from '../emails/email.module';
import { MulterModule } from '@nestjs/platform-express';
import { FirebaseModule } from '../../infrastructure/firebase/firebase.module';
import { QueueModule } from '../queue/queue.module';
import { FileService } from './services/file.service';
@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => RoleModule),
    forwardRef(() => PermissionModule),
    forwardRef(() => WorkingUnitModule),
    JwtModule,
    EmailModule,
    FirebaseModule,
    QueueModule,
    MulterModule.register({
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, FileService],
  exports: [UserService, UserRepository],
})
export class UserModule {}
