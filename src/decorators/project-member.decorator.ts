import { applyDecorators, UseGuards } from '@nestjs/common';
import { ProjectMemberGuard } from '@/guards/project-member.guard';
import { Auth } from './auth.decorator';
import { Permissions } from 'src/enum/permissions.enum';

export function ProjectMember(
  permission: Permissions,
): MethodDecorator & ClassDecorator {
  return applyDecorators(
    Auth(permission),
    UseGuards(ProjectMemberGuard),
  ) as MethodDecorator & ClassDecorator;
}
