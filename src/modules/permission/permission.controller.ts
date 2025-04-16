import { Controller, Post, Body, Get } from '@nestjs/common';
import { PermissionService } from './services/permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Permission } from './entities/permission.entity';
import { Auth } from '@/decorators/auth.decorator';
import { Permissions } from '@/enum/permissions.enum';

@Controller('permissions')
@Auth(Permissions.MANAGE_PERMISSIONS)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  async createPermission(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<Permission> {
    return this.permissionService.create(createPermissionDto);
  }

  @Get()
  async getAllPermissions(): Promise<Permission[]> {
    return this.permissionService.getAll();
  }
}
