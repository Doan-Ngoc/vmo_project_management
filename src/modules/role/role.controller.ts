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
import { Auth } from '@/decorators/auth.decorator';
import { Permissions } from '@/enum/permissions.enum';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Auth(Permissions.CREATE_ROLE)
  createRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @Auth(Permissions.GET_ALL_ROLES)
  getAllRoles(): Promise<Role[]> {
    return this.roleService.getAll();
  }

  @Get(':id')
  @Auth(Permissions.GET_ROLE_BY_ID)
  getRoleById(@Param('id') id: string): Promise<Role> {
    return this.roleService.getById(id);
  }

  @Put(':id')
  @Auth(Permissions.UPDATE_ROLE)
  updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @Auth(Permissions.DELETE_ROLE)
  deleteRole(@Param('id') id: string): Promise<void> {
    return this.roleService.delete(id);
  }
}
