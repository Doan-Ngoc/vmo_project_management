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

@Controller('comments')
export class TaskCommentController {
  constructor(private readonly taskCommentService: TaskCommentService) {}

  @Post()
  @ProjectMember(Permissions.CREATE_TASK_COMMENT)
  // @UseGuards(ProjectMemberGuard)
  // @Auth(Permissions.CREATE_TASK_COMMENT)
  async createTaskComment(
    @Body() createTaskCommentDto: CreateTaskCommentDto,
    @GetUser() user: User,
  ) {
    return this.taskCommentService.create(createTaskCommentDto, user.id);
  }

  // @Get(':id')
  @Get(':taskId')
  @ProjectMember(Permissions.GET_TASK_COMMENTS)
  async getCommentsByTask(
    @Param('taskId') taskId: string,
  ): Promise<TaskComment[]> {
    return this.taskCommentService.getByTask(taskId);
  }

  @Put(':commentId')
  @Auth(Permissions.UPDATE_TASK_COMMENT)
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

  @Delete(':commentId')
  // @ProjectMember(Permissions.DELETE_TASK_COMMENT)
  @Auth(Permissions.DELETE_TASK_COMMENT)
  async deleteTaskComment(
    @Param('commentId') commentId: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.taskCommentService.delete(commentId, user.id);
  }
}
