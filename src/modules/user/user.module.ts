import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/modules/auth/auth.module';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { RoleModule } from '../role/role.module';
import { WorkingUnitModule } from '../working-unit/working-unit.module';
import { CreateUserDto } from './dtos';
import { JwtModule } from '../jwt/jwt.module';
import { PermissionModule } from '../permission/permission.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    RoleModule,
    WorkingUnitModule,
    JwtModule,
    PermissionModule,
    MailModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
