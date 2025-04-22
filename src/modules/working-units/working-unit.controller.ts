import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { WorkingUnitService } from './services/working-unit.service';
import { WorkingUnit } from './entities/working-unit.entity';
import { Auth } from '../../decorators/auth.decorator';
import { Permissions } from '../../enum/permissions.enum';
import { CreateWorkingUnitDto } from './dtos/create-working-unit.dto';

@Controller('working-units')
export class WorkingUnitController {
  constructor(private readonly workingUnitService: WorkingUnitService) {}

  @Post()
  @Auth(Permissions.CREATE_WORKING_UNIT)
  async createWorkingUnit(
    @Body() createWorkingUnitDto: CreateWorkingUnitDto,
  ): Promise<WorkingUnit> {
    return this.workingUnitService.create(createWorkingUnitDto);
  }

  @Get()
  @Auth(Permissions.GET_ALL_WORKING_UNITS)
  async getAllWorkingUnits(): Promise<WorkingUnit[]> {
    return this.workingUnitService.getAll();
  }

  @Get(':id')
  @Auth(Permissions.GET_WORKING_UNIT_BY_ID)
  async getWorkingUnitById(@Param('id') id: string): Promise<WorkingUnit> {
    return this.workingUnitService.getById(id);
  }
}
