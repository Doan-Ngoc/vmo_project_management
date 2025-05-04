import { applyDecorators, UseGuards } from '@nestjs/common';
import { Auth } from './auth.decorator';
import { Permissions } from '../enum/permissions.enum';
import { TaskCommentOwnerGuard } from '../guards/task-comment-owner.guard';

export function TaskCommentOwner(
  permission: Permissions,
): MethodDecorator & ClassDecorator {
  return applyDecorators(
    Auth(permission),
    UseGuards(TaskCommentOwnerGuard),
  ) as MethodDecorator & ClassDecorator;
}
