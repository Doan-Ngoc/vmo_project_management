import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoleService } from './services/role.service';
import {
  CreateRoleDto,
  UpdateRoleDto,
  UpdateRolePermissionDto,
  DeleteRoleDto,
} from './dtos';
import { Role } from './entities/role.entity';
import { Auth } from '../../decorators/auth.decorator';
import { Permissions } from '../../enum/permissions.enum';
import { DeleteRolePermissionDto } from './dtos/delete-all-role-permissions.dto';

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

  @Patch()
  updateRole(@Body() updateRoleDto: UpdateRoleDto): Promise<Role> {
    return this.roleService.update(updateRoleDto);
  }

  @Delete()
  async deleteRole(@Body() deleteRoleDto: DeleteRoleDto) {
    await this.roleService.delete(deleteRoleDto);
    return { message: 'Role deleted successfully' };
  }

  //Role-Permission logic

  @Get(':id/permissions')
  async getRolePermissions(@Param('id') id: string) {
    return this.roleService.getRolePermissions(id);
  }

  //Update permissions of a role
  @Patch('/permissions')
  async updateRolePermissions(
    @Body() updateRolePermissionDto: UpdateRolePermissionDto,
  ) {
    return this.roleService.updateRolePermissions(updateRolePermissionDto);
  }

  // Remove all permissions from role
  @Delete('/permissions/all')
  async deleteAllPermissionsFromRole(
    @Body() deleteRolePermissionDto: DeleteRolePermissionDto,
  ) {
    await this.roleService.deleteAllPermissionsFromRole(
      deleteRolePermissionDto,
    );
    return { message: 'All permissions deleted from role' };
  }
}
