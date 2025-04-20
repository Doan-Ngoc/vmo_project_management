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
import { EmailModule } from '../emails/email.module';
import { FilesModule } from '../../shared/file-processing/file.module';
import { MulterModule } from '@nestjs/platform-express';
import { FirebaseModule } from '../../infrastructure/firebase/firebase.module';
import { QueueModule } from '../queue/queue.module';
@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => RoleModule),
    forwardRef(() => PermissionModule),
    forwardRef(() => FirebaseModule),
    WorkingUnitModule,
    JwtModule,
    EmailModule,
    FilesModule,
    MulterModule.register({
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
      },
    }),
    QueueModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
