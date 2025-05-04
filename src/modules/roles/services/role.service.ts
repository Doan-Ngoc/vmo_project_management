import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoleRepository } from '../repositories/role.repository';
import { Role } from '../entities/role.entity';
import {
  CreateRoleDto,
  UpdateRoleDto,
  DeleteRoleDto,
  UpdateRolePermissionDto,
} from '../dtos';
import { PermissionService } from '../../permissions/services/permission.service';
import { Permission } from '../../permissions/entities/permission.entity';
import { DataSource } from 'typeorm';
import { DeleteRolePermissionDto } from '../dtos/delete-all-role-permissions.dto';

@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly permissionService: PermissionService,
    private readonly dataSource: DataSource,
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

  async update(updateRoleDto: UpdateRoleDto): Promise<Role> {
    const { id, name } = updateRoleDto;
    const role = await this.getById(id);
    if (name !== role.name) {
      role.name = name;
    } else {
      throw new BadRequestException('Name is the same as the current name');
    }
    return await this.roleRepository.save(role);
  }

  async delete(deleteRoleDto: DeleteRoleDto) {
    const { id } = deleteRoleDto;
    const role = await this.getById(id);
    await this.roleRepository.softRemove(role);
  }

  // Role-Permission logic

  async getRolePermissions(roleId: string): Promise<Permission[]> {
    const role = await this.getById(roleId);
    return role.permissions;
  }

  async updateRolePermissions(
    updateRolePermissionDto: UpdateRolePermissionDto,
  ) {
    const { roleId, permissionIds } = updateRolePermissionDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Get role with its permissions
      const role = await this.roleRepository.findOne({
        where: { id: roleId },
        relations: ['permissions'],
      });

      if (!role) {
        throw new NotFoundException(`Role with ID ${roleId} not found`);
      }

      //Get current permissions
      const currentPermissions = role.permissions;
      const currentPermissionIds = currentPermissions.map(
        (permission) => permission.id,
      );

      // Separate permissions to be added and removed
      const permissionsToAddIds = permissionIds.filter(
        (id) => !currentPermissionIds.includes(id),
      );
      const permissionsToRemoveIds = currentPermissionIds.filter((id) =>
        permissionIds.includes(id),
      );

      // Remove permissions
      const permissionsAfterRemove = currentPermissions.filter(
        (permission) => !permissionsToRemoveIds.includes(permission.id),
      );

      // Add new permissions
      const permissionsToAdd = await Promise.all(
        permissionsToAddIds.map((id) => this.permissionService.getById(id)),
      );

      const permissionsAfterAdd = [
        ...permissionsAfterRemove,
        ...permissionsToAdd,
      ];

      // Save the role with updated permissions
      role.permissions = permissionsAfterAdd;
      const updatedRole = await queryRunner.manager.save(Role, role);

      await queryRunner.commitTransaction();
      return {
        role: updatedRole,
        permissions: permissionsAfterAdd,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async deleteAllPermissionsFromRole(
    deleteRolePermissionDto: DeleteRolePermissionDto,
  ) {
    const { id } = deleteRolePermissionDto;
    const role = await this.getById(id);
    role.permissions = [];
    await this.roleRepository.save(role);
  }
}
