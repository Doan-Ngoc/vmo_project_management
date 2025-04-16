import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { Permissions } from 'src/enum/permissions.enum';
import { ProjectMemberGuard } from '@/guards/project-member.guard';

export const PERMISSIONS_KEY = 'permission';
export function Auth(
  permission: Permissions,
): MethodDecorator & ClassDecorator {
  return applyDecorators(
    SetMetadata(PERMISSIONS_KEY, permission),
    UseGuards(AuthGuard),
  );
}

// export function ProjectMember(permission: Permissions): MethodDecorator {
//   return applyDecorators(
//     SetMetadata(PERMISSIONS_KEY, permission),
//     UseGuards(AuthGuard),
//     UseGuards(ProjectMemberGuard),
//   );
// }
