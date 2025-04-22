import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { RoleService } from './services/role.service';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { Role } from './entities/role.entity';
// import { Auth } from '@/decorators/auth.decorator';
import { Auth } from '../../decorators/auth.decorator';
// import { Permissions } from '@/enum/permissions.enum';
import { Permissions } from '../../enum/permissions.enum';
import { UpdateRolePermissionDto } from './dtos/update-role-permission.dto';

@Controller('roles')
@Auth(Permissions.MANAGE_ROLES)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  createRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  getAllRoles(): Promise<Role[]> {
    return this.roleService.getAll();
  }

  @Get(':id')
  getRoleById(@Param('id') id: string): Promise<Role> {
    return this.roleService.getById(id);
  }

  @Put(':id')
  updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  deleteRole(@Param('id') id: string): Promise<void> {
    return this.roleService.delete(id);
  }

  // Get role permissions
  @Get(':id/permissions')
  async getRolePermissions(@Param('id') id: string) {
    return this.roleService.getRolePermissions(id);
  }

  // Add permissions to role
  @Post(':id/permissions')
  async addPermissionsToRole(
    @Param('id') id: string,
    @Body() updateRolePermissionDto: UpdateRolePermissionDto,
  ) {
    return this.roleService.addPermissionsToRole(
      id,
      updateRolePermissionDto.permissionIds,
    );
  }

  // Remove permissions from role
  @Delete(':id/permissions')
  async removePermissionsFromRole(
    @Param('id') id: string,
    @Body() updateRolePermissionDto: UpdateRolePermissionDto,
  ) {
    return this.roleService.removePermissionsFromRole(
      id,
      updateRolePermissionDto.permissionIds,
    );
  }

  // Remove all permissions from role
  @Delete(':id/permissions/all')
  async removeAllPermissionsFromRole(@Param('id') id: string) {
    return this.roleService.removeAllPermissionsFromRole(id);
  }
}
