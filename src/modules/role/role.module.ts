import { forwardRef, Module } from '@nestjs/common';
import { RoleService } from './services/role.service';
import { RoleController } from './role.controller';
import { RoleRepository } from './repositories/role.repository';
import { Role } from './entities/role.entity';
import { JwtModule } from '../jwt/jwt.module';
import { PermissionModule } from '../permission/permission.module';
import { UserModule } from '../user/user.module';
@Module({
  imports: [JwtModule, PermissionModule, forwardRef(() => UserModule)],
  controllers: [RoleController],
  providers: [RoleService, RoleRepository],
  exports: [RoleService],
})
export class RoleModule {}
