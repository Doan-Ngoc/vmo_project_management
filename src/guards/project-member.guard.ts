import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ProjectService } from '../modules/projects/services/project.service';
import { AccountType } from '../enum/account-type.enum';
import { TaskService } from '../modules/tasks/services/task.service';
import { TaskCommentService } from '../modules/task_comments/services/task-comment.service';
@Injectable()
export class ProjectMemberGuard implements CanActivate {
  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private taskCommentService: TaskCommentService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Get projectId from either params or body
    let projectId = request.params?.projectId || request.body?.projectId;

    //For task and comment related requests, get the projectId from the task or comment
    if (!projectId) {
      let taskId = request.body?.taskId || request.params?.taskId;
      if (!taskId) {
        const commentId = request.body?.commentId || request.params?.commentId;
        if (!commentId) {
          throw new BadRequestException();
        }
        const comment = await this.taskCommentService.getById(commentId);
        taskId = comment.task.id;
      }
      const task = await this.taskService.getById(taskId);
      projectId = task.project.id;
    }

    //Get user from request
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException();
    }

    //Bypass authorization check for admin
    if (user.accountType === AccountType.ADMIN) {
      return true;
    }

    // Get project with its members
    const project = await this.projectService.getById(projectId);

    // Check if user is a member of the project
    const isMember = project.members.some((member) => member.id === user.id);

    if (!isMember) {
      throw new ForbiddenException('User is not a member of this project');
    }

    return true;
  }
}
