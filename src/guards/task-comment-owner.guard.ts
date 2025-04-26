import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { TaskCommentService } from '@/modules/task_comments/services/task-comment.service';
import { AccountType } from '@/enum/account-type.enum';

@Injectable()
export class TaskCommentOwnerGuard implements CanActivate {
  constructor(private taskCommentService: TaskCommentService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const taskCommentId = request.params?.commentId || request.body?.commentId;

    if (!taskCommentId) {
      throw new BadRequestException('Task comment ID is required');
    }

    const user = request.user;
    if (!user) {
      throw new UnauthorizedException();
    }

    // Bypass authorization check for admin
    if (user.accountType === AccountType.ADMIN) {
      return true;
    }

    const taskComment = await this.taskCommentService.getById(taskCommentId);

    // Check if user is the owner of the comment
    if (taskComment.createdBy.id !== user.id) {
      throw new ForbiddenException('Only the comment owner is allowed');
    }
    return true;
  }
}
