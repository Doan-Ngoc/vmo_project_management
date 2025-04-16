import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkingUnitRepository } from '../repositories/working-unit.repository';
import { WorkingUnit } from '../entities/working-unit.entity';

@Injectable()
export class WorkingUnitService {
  constructor(private readonly workingUnitRepository: WorkingUnitRepository) {}

  async getById(id: string): Promise<WorkingUnit> {
    const workingUnit = await this.workingUnitRepository.findOne({
      where: { id },
    });

    if (!workingUnit) {
      throw new NotFoundException(`Working unit with ID ${id} not found`);
    }

    return workingUnit;
  }
}
