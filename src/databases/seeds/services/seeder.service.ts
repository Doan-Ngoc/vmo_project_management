import { BadRequestException, Injectable } from '@nestjs/common';
import { PermissionService } from '@/modules/permissions/services/permission.service';
import * as fs from 'fs';
import * as path from 'path';
import { RoleService } from '@/modules/roles/services/role.service';
import { AccountType } from '@/enum/account-type.enum';
import { AccountStatus } from '@/enum/account-status.enum';
import { UserService } from '@/modules/users/services/user.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@/modules/auth/auth.service';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { PermissionRepository } from '@/modules/permissions/repositories/permission.repository';
@Injectable()
export class SeederService {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
    private readonly permissionRepository: PermissionRepository,
  ) {}

  async seedPermissions() {
    console.log('Starting permission seeder...');
    // Import JSON data
    const permissionData = require('../data/permission-seed-data.json');

    try {
      await this.permissionRepository.upsert(permissionData, ['id']);
      // await this.permissionService.upsertData(permissionData);
      console.log('Successfully seeded permissions');
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to seed permissions');
    }
  }

  async seedRolePermissions() {
    console.log('Starting role_permissions seeder...');
    const rolePermissionsData = require('../data/role-permissions-seed-data.json');

    try {
      //Group permissions by role
      const groupedPermissions = rolePermissionsData.reduce(
        (acc, rolePermission) => {
          if (!acc[rolePermission.role_id]) {
            acc[rolePermission.role_id] = [];
          }
          acc[rolePermission.role_id].push(rolePermission.permission_id);
          return acc;
        },
        {} as Record<string, string[]>,
      );

      //Update each role with its permissions
      for (const [role_id, permission_ids] of Object.entries(
        groupedPermissions,
      )) {
        await this.roleService.addPermissionsToRole(
          role_id,
          permission_ids as string[],
        );
      }
      console.log('Role_permissions data seeded successfully');
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to seed role_permissions');
    }
  }

  async seedDefaultAdmin() {
    try {
      console.log('Starting default admin seeder...');
      const password = this.configService.get('DEFAULT_ADMIN_PASSWORD');
      const hashedPassword = await this.authService.hashPassword(password);
      const defaultAdminData = {
        email: this.configService.get('DEFAULT_ADMIN_EMAIL'),
        username: this.configService.get('DEFAULT_ADMIN_EMAIL'),
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
      throw new BadRequestException('Failed to seed default admin');
    }
  }
}
