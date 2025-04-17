import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '@/modules/permissions/entities/permission.entity';
import { permissionsData } from '../data/permissions.data';
import { PermissionService } from '@/modules/permissions/services/permission.service';
@Injectable()
export class PermissionSeederService {
  constructor(private readonly permissionService: PermissionService) {}

  async seed() {
    console.log('Starting permission seeder...');
    const existingPermissions = await this.permissionService.getAll();
    const existingPermissionNames = existingPermissions.map(
      (permission) => permission.name,
    );

    // Filter out permissions that already exist
    const newPermissions = permissionsData.filter(
      (p) => !existingPermissionNames.includes(p.name),
    );

    if (newPermissions.length === 0) {
      console.log('All permissions already exist in the database');
      return;
    }
    console.log(
      'Permissions to be created:',
      newPermissions.map((p) => p.name),
    );

    // Create new permissions
    try {
      const permissions = await this.permissionService.create(newPermissions);

      console.log(
        'Successfully created permissions:',
        permissions.map((permission) => permission.name),
      );
    } catch (error) {
      console.error('Error creating permissions:', error);
      throw new BadRequestException();
    }
  }
}
