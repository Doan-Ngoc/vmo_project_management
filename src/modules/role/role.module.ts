import { Module } from '@nestjs/common';
import { RoleService } from './services/role.service';
import { RoleController } from './role.controller';
import { RoleRepository } from './repositories/role.repository';
import { Role } from './entities/role.entity';

@Module({
  controllers: [RoleController],
  providers: [RoleService, RoleRepository],
  exports: [RoleService],
})
export class RoleModule {}
