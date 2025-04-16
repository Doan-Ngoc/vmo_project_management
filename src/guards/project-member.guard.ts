import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { ProjectService } from '../modules/project/services/project.service';
import { AccountStatus } from '@/enum/account-status.enum';
import { AccountType } from '@/enum/account-type.enum';
import { TaskService } from '@/modules/task/services/task.service';
@Injectable()
export class ProjectMemberGuard implements CanActivate {
  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // Get projectId from either params or body
    let projectId = request.params?.projectId || request.body?.projectId;

    // For requests that only send taskId, get project from task
    if (!projectId) {
      const taskId = request.params?.taskId || request.body?.taskId;
      if (!taskId) throw new BadRequestException();
      const task = await this.taskService.getById(taskId);
      if (!task) {
        throw new NotFoundException('Task not found');
      }
      if (!task.project?.id)
        throw new BadRequestException(
          'Task is not associated with any project',
        );
      projectId = task.project.id;
    }

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
