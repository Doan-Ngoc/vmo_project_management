import { applyDecorators, UseGuards } from '@nestjs/common';
// import { TaskMemberGuard } from '@/guards/task-member.guard';
import { TaskMemberGuard } from '../guards/task-member.guard';
import { Auth } from './auth.decorator';
// import { Permissions } from 'src/enum/permissions.enum';
// import { WorkingUnitMemberGuard } from '@/guards/working-unit-member.guard';
import { Permissions } from '../enum/permissions.enum';
import { WorkingUnitMemberGuard } from '../guards/working-unit-member.guard';

export function WorkingUnitMember(
  permission: Permissions,
): MethodDecorator & ClassDecorator {
  return applyDecorators(
    Auth(permission),
    UseGuards(WorkingUnitMemberGuard),
  ) as MethodDecorator & ClassDecorator;
}
