import { Controller } from '@nestjs/common';
import { WorkingUnitService } from './services/working-unit.service';

@Controller('working-units')
export class WorkingUnitController {
  constructor(private readonly workingUnitService: WorkingUnitService) {}
}
