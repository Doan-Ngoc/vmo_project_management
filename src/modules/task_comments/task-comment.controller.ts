import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { TaskCommentService } from './services/task-comment.service';
import { GetUser } from '@/decorators/get-user.decorator';
import { CreateTaskCommentDto } from './dto/create-task-comment.dto';
import { TaskMemberGuard } from '@/guards/task-member.guard';
import { Auth } from '@/decorators/auth.decorator';
import { Permissions } from '@/enum/permissions.enum';
import { User } from '@/modules/user/entities/user.entity';

@Controller('comments')
export class TaskCommentController {
  constructor(private readonly taskCommentService: TaskCommentService) {}

  @Post()
  @UseGuards(TaskMemberGuard)
  @Auth(Permissions.CREATE_TASK_COMMENT)
  async createTaskComment(
    @Body() createTaskCommentDto: CreateTaskCommentDto,
    @GetUser() user: User,
  ) {
    return this.taskCommentService.create(createTaskCommentDto, user.id);
  }
}
