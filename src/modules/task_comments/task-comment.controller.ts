import {
  Body,
  Controller,
  Param,
  Post,
  Delete,
  Get,
  Patch,
} from '@nestjs/common';
import { TaskCommentService } from './services/task-comment.service';
import { GetUser } from '../../decorators/get-user.decorator';
import {
  CreateTaskCommentDto,
  UpdateTaskCommentDto,
  DeleteTaskCommentDto,
} from './dto';
import { Permissions } from '@/enum/permissions.enum';
import { User } from '@/modules/users/entities/user.entity';
import { ProjectMember } from '@/decorators/project-member.decorator';

import { TaskComment } from './entities/task-comment.entity';
import { TaskCommentOwner } from '@/decorators/task-comment-owner.decorator';

@Controller('comments')
export class TaskCommentController {
  constructor(private readonly taskCommentService: TaskCommentService) {}

  @Post()
  @ProjectMember(Permissions.CREATE_TASK_COMMENT)
  async createTaskComment(
    @Body() createTaskCommentDto: CreateTaskCommentDto,
    @GetUser() user: User,
  ) {
    return this.taskCommentService.create(createTaskCommentDto, user.id);
  }

  @Get('/task/:taskId')
  @ProjectMember(Permissions.GET_ALL_TASK_COMMENTS)
  async getCommentsByTask(
    @Param('taskId') taskId: string,
  ): Promise<TaskComment[]> {
    return this.taskCommentService.getByTask(taskId);
  }

  @Patch()
  @TaskCommentOwner(Permissions.UPDATE_TASK_COMMENT)
  async updateTaskComment(
    @Body() updateTaskCommentDto: UpdateTaskCommentDto,
    @GetUser() user: User,
  ): Promise<TaskComment> {
    return await this.taskCommentService.update(updateTaskCommentDto, user.id);
  }

  @Delete()
  @TaskCommentOwner(Permissions.DELETE_TASK_COMMENT)
  async deleteTaskComment(
    @Body() deleteTaskCommentDto: DeleteTaskCommentDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.taskCommentService.delete(deleteTaskCommentDto, user.id);
  }
}
