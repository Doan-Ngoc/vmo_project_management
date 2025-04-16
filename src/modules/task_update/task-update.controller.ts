import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { TaskUpdateService } from './services/task-update.service';
import { User } from '../user/entities/user.entity';

@Controller('tasks/:taskId/updates')
// @UseGuards(JwtAuthGuard)
export class TaskUpdateController {
  constructor(private readonly taskUpdateService: TaskUpdateService) {}

  // @Post()
  // async createTaskUpdate(
  //   @Param('taskId') taskId: string,
  //   @Body('content') content: string,
  // ) {
  //   return this.taskUpdateService.createTaskUpdate(taskId, content);
  // }
}
