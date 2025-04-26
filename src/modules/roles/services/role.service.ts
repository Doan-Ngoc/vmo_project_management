import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoleRepository } from '../repositories/role.repository';
import { Role } from '../entities/role.entity';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { UpdateRoleDto } from '../dtos/update-role.dto';
import { PermissionService } from '../../permissions/services/permission.service';
import { Permission } from '../../permissions/entities/permission.entity';

@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly permissionService: PermissionService,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      const role = this.roleRepository.create({
        name: createRoleDto.name,
      });
      return await this.roleRepository.save(role);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Role already exists');
      }
      throw new BadRequestException();
    }
  }

  async getAll(): Promise<Role[]> {
    return await this.roleRepository.find({
      relations: ['permissions'],
    });
  }

  async getById(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async getByName(name: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { name },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException(`Role with name ${name} not found`);
    }

    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const { name } = updateRoleDto;
    const role = await this.getById(id);
    if (name !== role.name) {
      role.name = name;
    } else {
      throw new BadRequestException('Name is the same as the current name');
    }
    return await this.roleRepository.save(role);
  }

  async delete(id: string) {
    const role = await this.getById(id);
    await this.roleRepository.softRemove(role);
    return { message: 'Role deleted successfully' };
  }

  async addPermissionsToRole(
    roleId: string,
    permissionIds: string[],
  ): Promise<Role> {
    const role = await this.getById(roleId);

    const permissions = await Promise.all(
      permissionIds.map((id) => this.permissionService.getById(id)),
    );

    role.permissions = [...role.permissions, ...permissions];

    return this.roleRepository.save(role);
  }

  async removePermissionsFromRole(
    roleId: string,
    permissionIds: string[],
  ): Promise<Role> {
    const role = await this.getById(roleId);

    role.permissions = role.permissions.filter(
      (permission) => !permissionIds.includes(permission.id),
    );

    return this.roleRepository.save(role);
  }

  async getRolePermissions(roleId: string): Promise<Permission[]> {
    const role = await this.getById(roleId);
    return role.permissions;
  }

  async removeAllPermissionsFromRole(roleId: string): Promise<Role> {
    const role = await this.getById(roleId);
    role.permissions = [];

    return this.roleRepository.save(role);
  }
}
