import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleRepository } from '../repositories/role.repository';
import { Role } from '../entities/role.entity';
import { RoleName } from '../../../enum/role.enum';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async getById(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  async findByName(name: RoleName): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { name },
    });

    if (!role) {
      throw new NotFoundException(`Role with name ${name} not found`);
    }

    return role;
  }
}
