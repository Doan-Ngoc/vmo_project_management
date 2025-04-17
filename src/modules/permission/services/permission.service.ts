import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { Permission } from '../entities/permission.entity';
import { PermissionRepository } from '../repositories/permission.repository';
import { Role } from '../../role/entities/role.entity';

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  //Create New Permission
  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
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

  //Get All Permissions
  async getAll(): Promise<Permission[]> {
    return await this.permissionRepository.find({
      relations: ['roles'],
    });
  }

  //Get Permission Roles
  async getPermissionRoles(requiredPermission: string): Promise<string[]> {
    const permission = await this.permissionRepository.findOne({
      where: { name: requiredPermission },
      relations: ['roles'],
    });
    console.log(requiredPermission);
    console.log(permission);
    return permission ? permission.roles.map((role) => role.id) : [];
  }

  async getById(id: string): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    return permission;
  }
}
