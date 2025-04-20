import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
  Get,
} from '@nestjs/common';
import { TaskCommentService } from './services/task-comment.service';
import { GetUser } from '@/decorators/get-user.decorator';
import { CreateTaskCommentDto } from './dto/create-task-comment.dto';
import { TaskMemberGuard } from '@/guards/task-member.guard';
import { Auth } from '@/decorators/auth.decorator';
import { Permissions } from '@/enum/permissions.enum';
import { User } from '@/modules/users/entities/user.entity';
import { ProjectMemberGuard } from '@/guards/project-member.guard';
import { ProjectMember } from '@/decorators/project-member.decorator';
import { UpdateTaskCommentDto } from './dto/update-task-comment.dto';
import { TaskComment } from './entities/task-comment.entity';
import { TaskMember } from '@/decorators/task-member.decorator';
import { TaskCommentOwner } from '@/decorators/task-comment-owner.decorator';

@Controller('comments')
export class TaskCommentController {
  constructor(private readonly taskCommentService: TaskCommentService) {}

  @ProjectMember(Permissions.CREATE_TASK_COMMENT)
  @Post()
  async createTaskComment(
    @Body() createTaskCommentDto: CreateTaskCommentDto,
    @GetUser() user: User,
  ) {
    return this.taskCommentService.create(createTaskCommentDto, user.id);
  }

  @ProjectMember(Permissions.GET_ALL_TASK_COMMENTS)
  @Get(':taskId')
  async getCommentsByTask(
    @Param('taskId') taskId: string,
  ): Promise<TaskComment[]> {
    return this.taskCommentService.getByTask(taskId);
  }

  @TaskCommentOwner(Permissions.UPDATE_TASK_COMMENT)
  @Put(':commentId')
  async updateTaskComment(
    @Param('commentId') commentId: string,
    @Body() updateTaskCommentDto: UpdateTaskCommentDto,
    @GetUser() user: User,
  ): Promise<TaskComment> {
    return await this.taskCommentService.update(
      commentId,
      updateTaskCommentDto,
      user.id,
    );
  }

  @TaskCommentOwner(Permissions.DELETE_TASK_COMMENT)
  @Delete(':commentId')
  async deleteTaskComment(
    @Param('commentId') commentId: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.taskCommentService.delete(commentId, user.id);
  }
}
