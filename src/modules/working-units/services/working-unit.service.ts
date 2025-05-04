import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkingUnitRepository } from '../repositories/working-unit.repository';
import { WorkingUnit } from '../entities/working-unit.entity';
import { CreateWorkingUnitDto } from '../dtos';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class WorkingUnitService {
  constructor(private readonly workingUnitRepository: WorkingUnitRepository) {}

  async create(
    createWorkingUnitDto: CreateWorkingUnitDto,
  ): Promise<WorkingUnit> {
    return this.workingUnitRepository.save(createWorkingUnitDto);
  }

  async getById(id: string): Promise<WorkingUnit> {
    const workingUnit = await this.workingUnitRepository.findOne({
      where: { id },
      relations: ['members'],
    });

    if (!workingUnit) {
      throw new NotFoundException(`Working unit with ID ${id} not found`);
    }

    return workingUnit;
  }

  async getAll(): Promise<WorkingUnit[]> {
    return await this.workingUnitRepository.find();
  }

  async getByName(name: string): Promise<WorkingUnit> {
    const workingUnit = await this.workingUnitRepository.findOne({
      where: { name },
    });

    if (!workingUnit) {
      throw new NotFoundException(`Working unit with name ${name} not found`);
    }

    return workingUnit;
  }

  async getWorkingUnitMembers(workingUnitId: string): Promise<User[]> {
    const workingUnit = await this.getById(workingUnitId);
    return workingUnit.members;
  }
}
