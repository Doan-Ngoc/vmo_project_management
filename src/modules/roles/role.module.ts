import { forwardRef, Module } from '@nestjs/common';
import { RoleService } from './services/role.service';
import { RoleController } from './role.controller';
import { RoleRepository } from './repositories/role.repository';
import { Role } from './entities/role.entity';
import { JwtModule } from '../jwt/jwt.module';
import { PermissionModule } from '../permissions/permission.module';
import { UserModule } from '../users/user.module';
@Module({
  imports: [
    JwtModule,
    forwardRef(() => PermissionModule),
    forwardRef(() => UserModule),
  ],
  controllers: [RoleController],
  providers: [RoleService, RoleRepository],
  exports: [RoleService, RoleRepository],
})
export class RoleModule {}
