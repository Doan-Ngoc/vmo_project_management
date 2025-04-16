import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { WorkingUnit } from '../entities/working-unit.entity';

@Injectable()
export class WorkingUnitRepository extends Repository<WorkingUnit> {
  constructor(private dataSource: DataSource) {
    super(WorkingUnit, dataSource.createEntityManager());
  }
}
