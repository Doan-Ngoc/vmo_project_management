import { applyDecorators, UseGuards } from '@nestjs/common';
// import { TaskMemberGuard } from '@/guards/task-member.guard';
import { TaskMemberGuard } from '../guards/task-member.guard';
import { Auth } from './auth.decorator';
// import { Permissions } from 'src/enum/permissions.enum';
import { Permissions } from '../enum/permissions.enum';

export function TaskMember(
  permission: Permissions,
): MethodDecorator & ClassDecorator {
  return applyDecorators(
    Auth(permission),
    UseGuards(TaskMemberGuard),
  ) as MethodDecorator & ClassDecorator;
}
