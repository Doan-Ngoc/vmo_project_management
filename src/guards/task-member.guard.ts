import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { ProjectService } from '../modules/projects/services/project.service';
import { AccountStatus } from '@/enum/account-status.enum';
import { AccountType } from '@/enum/account-type.enum';
import { TaskService } from '@/modules/tasks/services/task.service';
@Injectable()
export class TaskMemberGuard implements CanActivate {
  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // Get projectId from either params or body
    let taskId = request.params?.taskId || request.body?.taskId;

    // For requests that only send taskId, get project from task
    // if (!taskId) {
    //   const taskCommentId =
    //     request.params?.taskCommentId || request.body?.taskCommentId;
    //   if (!taskCommentId) throw new BadRequestException();
    //   const taskComment = await this.taskCommentService.getById(taskCommentId);
    //   if (!taskComment) {
    //     throw new NotFoundException('Task comment not found');
    //   }
    //   if (!taskComment.task?.id)
    //     throw new BadRequestException(
    //       'Task comment is not associated with any task',
    //     );
    //   taskId = taskComment.task.id;
    // }

    const task = await this.taskService.getById(taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException();
    }

    //If user is admin, allow access
    if (user.accountType === AccountType.ADMIN) {
      return true;
    }
    // If user is a member of the project and is a pm or tech lead, allow access
    const managerRoles = ['pm', 'tech_lead'];
    const project = await this.projectService.getById(task.project.id);

    const isManager = project.members.some(
      (member) =>
        member.id === user.id &&
        managerRoles.includes(member.role.name.toLowerCase()),
    );

    if (isManager) {
      return true;
    }

    // const isPM = project.members.some(
    //   (member) => member.id === user.id && member.role.name === 'pm',
    // );
    // if (isPM) {
    //   return true;
    // }

    // Check if user is assigned for the task
    const isMember = task.members.some((member) => member.id === user.id);

    if (!isMember) {
      throw new ForbiddenException('User is not assigned for this task');
    }

    return true;
  }
}
