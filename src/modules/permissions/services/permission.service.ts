import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePermissionDto } from '../dtos';
import { Permission } from '../entities/permission.entity';
import { PermissionRepository } from '../repositories/permission.repository';

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async create(
    createPermissionDtos: CreatePermissionDto[],
  ): Promise<Permission[]> {
    try {
      const permissions =
        this.permissionRepository.create(createPermissionDtos);
      return await this.permissionRepository.save(permissions);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async getAll(): Promise<Permission[]> {
    return await this.permissionRepository.find({
      relations: ['roles'],
    });
  }

  async getById(id: string): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!permission) {
      throw new NotFoundException(`Permission with id ${id} not found`);
    }
    return permission;
  }

  async getPermissionRoles(requiredPermission: string): Promise<string[]> {
    const permission = await this.permissionRepository.findOne({
      where: { name: requiredPermission },
      relations: ['roles'],
    });
    return permission ? permission.roles.map((role) => role.id) : [];
  }
}
