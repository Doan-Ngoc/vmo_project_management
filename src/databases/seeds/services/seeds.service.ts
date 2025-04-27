import { BadRequestException, Injectable } from '@nestjs/common';
import { RoleService } from '../../../modules/roles/services/role.service';
import { AccountType } from '../../../enum/account-type.enum';
import { AccountStatus } from '../../../enum/account-status.enum';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../../modules/auth/auth.service';
import { UserRepository } from '../../../modules/users/repositories/user.repository';
import { PermissionRepository } from '../../../modules/permissions/repositories/permission.repository';
import { PERMISSION_SEED_DATA } from '../data/permission-seed-data';
import { RolePermissionSeedData } from '../data/role-permissions-seed-data';
import { RoleRepository } from '../../../modules/roles/repositories/role.repository';
import { ROLE_SEED_DATA } from '../data/role-seed-data';

@Injectable()
export class SeedsService {
  constructor(
    private readonly roleService: RoleService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
    private readonly permissionRepository: PermissionRepository,
    private readonly rolePermissionSeedData: RolePermissionSeedData,
    private readonly roleRepository: RoleRepository,
  ) {}

  async seedPermissions() {
    try {
      console.log('Starting permission seeding...');
      await this.permissionRepository.upsert(PERMISSION_SEED_DATA, ['name']);
      console.log('Permission seeding completed');
    } catch (error) {
      console.error('Error seeding permissions:', error);
      throw error;
    }
  }

  async seedRoles() {
    try {
      console.log('Starting role seeding...');
      await this.roleRepository.upsert(ROLE_SEED_DATA, ['name']);
      console.log('Role seeding completed');
    } catch (error) {
      console.error('Error seeding roles:', error);
      throw error;
    }
  }

  async seedRolePermissions() {
    console.log('Starting role permission seeding...');
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
