// import { BadRequestException, Injectable } from '@nestjs/common';
// import { PermissionService } from '@/modules/permissions/services/permission.service';
// import * as fs from 'fs';
// import * as path from 'path';
// import { RoleService } from '@/modules/roles/services/role.service';
// import { AccountType } from '@/enum/account-type.enum';
// import { AccountStatus } from '@/enum/account-status.enum';
// import { UserService } from '@/modules/users/services/user.service';
// import { ConfigService } from '@nestjs/config';
// import { AuthService } from '@/modules/auth/auth.service';
// import { UserRepository } from '@/modules/users/repositories/user.repository';
// import { PermissionRepository } from '@/modules/permissions/repositories/permission.repository';
// import { PERMISSION_SEED_DATA } from '../data/new-permission-seed-data';
// import { RolePermissionSeedData } from '../data/new-role-permissions-seed-data';
// import { RoleName } from '@/enum/role.enum';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PermissionService } from '../../../modules/permissions/services/permission.service';
import * as fs from 'fs';
import * as path from 'path';
import { RoleService } from '../../../modules/roles/services/role.service';
import { AccountType } from '../../../enum/account-type.enum';
import { AccountStatus } from '../../../enum/account-status.enum';
import { UserService } from '../../../modules/users/services/user.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../../modules/auth/auth.service';
import { UserRepository } from '../../../modules/users/repositories/user.repository';
import { PermissionRepository } from '../../../modules/permissions/repositories/permission.repository';
import { PERMISSION_SEED_DATA } from '../data/permission-seed-data';
import { RolePermissionSeedData } from '../data/role-permissions-seed-data';
import { RoleName } from '../../../enum/role.enum';
import { RoleRepository } from '../../../modules/roles/repositories/role.repository';
import { ROLE_SEED_DATA } from '../data/role-seed-data';

@Injectable()
export class SeedsService {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
    private readonly permissionRepository: PermissionRepository,
    private readonly rolePermissionSeedData: RolePermissionSeedData,
    private readonly roleRepository: RoleRepository,
  ) {}

  async seedPermissions() {
    try {
      const existingPermissions = await this.permissionRepository.find();
      const existingPermissionNames = new Set(
        existingPermissions.map((p) => p.name),
      );
      await this.permissionRepository.upsert(PERMISSION_SEED_DATA, ['name']);
      console.log('Permission seeding completed');
      // Get all existing permissions
      const newPermissions = await this.permissionRepository.find();

      // Filter out permissions that already exist
      const seededPermissions = newPermissions.filter(
        (permission) => !existingPermissionNames.has(permission.name),
      );

      if (seededPermissions.length > 0) {
        console.log(
          `Added ${seededPermissions.length} new permissions`,
          seededPermissions,
        );
      } else {
        console.log('No new permissions to add');
      }
    } catch (error) {
      console.error('Error seeding permissions:', error);
      throw error;
    }
  }

  async seedRoles() {
    try {
      const existingRoles = await this.roleService.getAll();
      const existingRoleNames = new Set(existingRoles.map((r) => r.name));

      await this.roleRepository.upsert(ROLE_SEED_DATA, ['name']);
      console.log('Role seeding completed');
      // Get all existing roles
      const newRoles = await this.roleRepository.find();

      // Filter out roles that already exist
      const seededRoles = newRoles.filter(
        (role) => !existingRoleNames.has(role.name),
      );
      if (seededRoles.length > 0) {
        console.log(`Added ${seededRoles.length} new roles`, seededRoles);
        console.log(seededRoles);
      } else {
        console.log('No new role to add');
      }
    } catch (error) {
      console.error('Error seeding roles:', error);
      throw error;
    }
  }

  async seedRolePermissions() {
    try {
      // Get role-permission data
      const rolePermissionData =
        await this.rolePermissionSeedData.seedRolePermission();

      // Add permissions to each role
      for (const rolePermission of rolePermissionData) {
        const { roleId, permissionIds } = rolePermission;
        await this.roleService.addPermissionsToRole(
          roleId as string,
          permissionIds,
        );
      }
      console.log('Role permissions seeded successfully');
    } catch (error) {
      console.error('Error seeding role permissions:', error);
      throw error;
    }
  }

  async seedDefaultAdmin() {
    try {
      console.log('Starting default admin seeder...');
      const password = this.configService.getOrThrow('DEFAULT_ADMIN_PASSWORD');
      const hashedPassword = await this.authService.hashPassword(password);
      const defaultAdminData = {
        email: this.configService.getOrThrow('DEFAULT_ADMIN_EMAIL'),
        username: this.configService.getOrThrow('DEFAULT_ADMIN_EMAIL'),
        hashedPassword,
        employeeName: 'Default Admin',
        accountType: AccountType.ADMIN,
        accountStatus: AccountStatus.ACTIVE,
      };
      const defaultAdmin = await this.userRepository.create(defaultAdminData);
      await this.userRepository.save(defaultAdmin);
      console.log('Default admin seeded successfully');
      return defaultAdmin;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to seed default admin', error);
    }
  }
}
