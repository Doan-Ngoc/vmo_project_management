import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { Permission } from '../entities/permission.entity';
import { PermissionRepository } from '../repositories/permission.repository';
import { Role } from '../../role/entities/role.entity';

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  //Create New Permission
  async createPermission(
    createPermissionDto: CreatePermissionDto,
  ): Promise<Permission> {
    try {
      const permission = this.permissionRepository.create(createPermissionDto);
      return await this.permissionRepository.save(permission);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Permission name already exists');
      }
      throw new BadRequestException();
    }
  }

  //Get Permission Roles
  async getPermissionRoles(requiredPermission: string): Promise<string[]> {
    const permission = await this.permissionRepository.findOne({
      where: { name: requiredPermission },
      relations: ['roles'],
    });

    return permission ? permission.roles.map((role) => role.id) : [];
  }
}
