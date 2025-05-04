import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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
import { DataSource } from 'typeorm';
import { Role } from '../../../modules/roles/entities/role.entity';
import { Permission } from '../../../modules/permissions/entities/permission.entity';

@Injectable()
export class SeedsService {
  private readonly logger = new Logger(SeedsService.name);

  constructor(
    private readonly roleService: RoleService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
    private readonly permissionRepository: PermissionRepository,
    private readonly rolePermissionSeedData: RolePermissionSeedData,
    private readonly roleRepository: RoleRepository,
    private readonly dataSource: DataSource,
  ) {}

  async seedPermissions() {
    try {
      this.logger.log('Starting permission seeding...');
      await this.permissionRepository.upsert(PERMISSION_SEED_DATA, ['name']);
      this.logger.log('Permission seeding completed');
    } catch (error) {
      this.logger.error('Error seeding permissions:', error);
      throw error;
    }
  }

  async seedRoles() {
    try {
      this.logger.log('Starting role seeding...');
      await this.roleRepository.upsert(ROLE_SEED_DATA, ['name']);
      this.logger.log('Role seeding completed');
    } catch (error) {
      this.logger.error('Error seeding roles:', error);
      throw error;
    }
  }

  async seedRolePermissions() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      this.logger.log('Starting role permission seeding...');
      const rolePermissionData =
        await this.rolePermissionSeedData.seedRolePermission();

      for (const rolePermission of rolePermissionData) {
        const { roleId, permissionIds } = rolePermission;
        const role = await queryRunner.manager.findOne(Role, {
          where: { id: roleId },
          relations: ['permissions'],
        });

        if (!role) {
          throw new NotFoundException(`Role with ID ${roleId} not found`);
        }

        const permissions = await Promise.all(
          permissionIds.map(async (id) => {
            const permission = await queryRunner.manager.findOne(Permission, {
              where: { id },
            });
            if (!permission) {
              throw new NotFoundException(`Permission with ID ${id} not found`);
            }
            return permission;
          }),
        );

        role.permissions = [...role.permissions, ...permissions];
        await queryRunner.manager.save(role);
      }

      await queryRunner.commitTransaction();
      this.logger.log('Role permissions seeded successfully');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error seeding role permissions:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async seedDefaultAdmin() {
    try {
      this.logger.log('Starting default admin seeder...');
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
      this.logger.log('Default admin seeded successfully');
      return defaultAdmin;
    } catch (error) {
      this.logger.error('Failed to seed default admin', error);
      throw new BadRequestException('Failed to seed default admin', error);
    }
  }
}
