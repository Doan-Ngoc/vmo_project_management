import {
  Body,
  Controller,
  Param,
  Post,
  Delete,
  Get,
  Patch,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { TaskCommentService } from './services/task-comment.service';
import { GetUser } from '../../decorators/get-user.decorator';
import {
  CreateTaskCommentDto,
  UpdateTaskCommentDto,
  DeleteTaskCommentDto,
  CreateCommentReplyDto,
} from './dto';
import { Permissions } from '../../enum/permissions.enum';
import { User } from '../users/entities/user.entity';
import { ProjectMember } from '../../decorators/project-member.decorator';
import { TaskComment } from './entities/task-comment.entity';
import { TaskCommentOwner } from '../../decorators/task-comment-owner.decorator';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

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

  @Post('/replies')
  @ProjectMember(Permissions.CREATE_COMMENT_REPLY)
  async createCommentReply(
    @Body() createCommentReplyDto: CreateCommentReplyDto,
    @GetUser() user: User,
  ) {
    return this.taskCommentService.createReply(createCommentReplyDto, user.id);
  }

  @Get('/task/:taskId')
  @ProjectMember(Permissions.GET_ALL_TASK_COMMENTS)
  async getTaskComments(
    @Param('taskId') taskId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(2), ParseIntPipe) limit: number,
  ): Promise<Pagination<TaskComment>> {
    limit = limit > 10 ? 10 : limit;
    const options: IPaginationOptions = {
      page,
      limit,
      route: `/comments/task/${taskId}`,
    };
    return this.taskCommentService.getTaskComments(taskId, options);
  }

  @Get('/:commentId/replies')
  @ProjectMember(Permissions.GET_COMMENT_REPLIES)
  async getCommentReplies(
    @Param('commentId') commentId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(2), ParseIntPipe) limit: number,
  ): Promise<Pagination<TaskComment>> {
    limit = limit > 10 ? 10 : limit;
    const options: IPaginationOptions = {
      page,
      limit,
      route: `/comments/${commentId}/replies`,
    };
    return this.taskCommentService.getReplies(commentId, options);
  }

  @Get('/:commentId')
  @ProjectMember(Permissions.GET_TASK_COMMENT_BY_ID)
  async getTaskCommentById(
    @Param('commentId') commentId: string,
  ): Promise<TaskComment> {
    return this.taskCommentService.getById(commentId);
  }

  @Patch()
  @TaskCommentOwner(Permissions.UPDATE_TASK_COMMENT)
  async updateTaskComment(
    @Body() updateTaskCommentDto: UpdateTaskCommentDto,
  ): Promise<TaskComment> {
    return await this.taskCommentService.update(updateTaskCommentDto);
  }

  @Delete()
  @TaskCommentOwner(Permissions.DELETE_TASK_COMMENT)
  async deleteTaskComment(@Body() deleteTaskCommentDto: DeleteTaskCommentDto) {
    await this.taskCommentService.delete(deleteTaskCommentDto);
    return { message: 'Comment deleted successfully' };
  }
}
