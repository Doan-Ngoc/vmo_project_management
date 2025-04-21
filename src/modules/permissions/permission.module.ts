import { forwardRef, Module } from '@nestjs/common';
import { PermissionService } from './services/permission.service';
import { PermissionController } from './permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { PermissionRepository } from './repositories/permission.repository';
import { JwtModule } from '../jwt/jwt.module';
import { UserModule } from '../users/user.module';
@Module({
  imports: [JwtModule, forwardRef(() => UserModule)],
  controllers: [PermissionController],
  providers: [PermissionService, PermissionRepository],
  exports: [PermissionService, PermissionRepository],
})
export class PermissionModule {}
