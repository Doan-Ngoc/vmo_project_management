import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TaskService } from './services/task.service';
import { Auth } from '../../decorators/auth.decorator';
import { Permissions } from '../../enum/permissions.enum';
import { GetUser } from '../../decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { Task } from './entities/task.entity';
import { TaskMemberGuard } from '../../guards/task-member.guard';
import {
  CreateTaskDto,
  DeleteTaskDto,
  UpdateTaskStatusDto,
  UpdateTaskDataDto,
  UpdateTaskMemberDto,
} from './dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { ProjectMember } from '../../decorators/project-member.decorator';
import { TaskMember } from '../../decorators/task-member.decorator';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ProjectMember(Permissions.CREATE_TASK)
  createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    return this.taskService.createTask(createTaskDto, user.id);
  }

  @Get(':taskId')
  @ProjectMember(Permissions.GET_TASK_BY_ID)
  getTaskById(@Param('taskId') id: string): Promise<Task> {
    return this.taskService.getById(id);
  }

  //Get all tasks of a project
  @Get('/project/:projectId')
  @ProjectMember(Permissions.GET_ALL_TASKS)
  async getAllTasks(
    @Param('projectId') projectId: string,
    @Query('search') query: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(2), ParseIntPipe) limit: number,
  ): Promise<Pagination<Task>> {
    limit = limit > 10 ? 10 : limit;
    const options: IPaginationOptions = {
      page,
      limit,
      route: `/tasks/project/${projectId}`,
    };
    return this.taskService.getAllTasks(projectId, options, query);
  }

  @Patch('/status')
  @ProjectMember(Permissions.UPDATE_TASK_STATUS)
  updateStatus(
    @Body() updateStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ) {
    return this.taskService.updateStatus(updateStatusDto, user.id);
  }

  @Patch('/members')
  @ProjectMember(Permissions.UPDATE_TASK_MEMBERS)
  updateTaskMembers(@Body() updateTaskMemberDto: UpdateTaskMemberDto) {
    return this.taskService.updateTaskMembers(updateTaskMemberDto);
  }

  @Patch()
  @TaskMember(Permissions.UPDATE_TASK_DATA)
  async updateTaskData(
    @Body() updateTaskDataDto: UpdateTaskDataDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.updateTaskData(updateTaskDataDto, user.id);
  }

  @Delete()
  @ProjectMember(Permissions.DELETE_TASK)
  async deleteTask(
    @Body() deleteTaskDto: DeleteTaskDto,
    @GetUser() user: User,
  ) {
    await this.taskService.delete(deleteTaskDto, user.id);
    return { message: 'Task deleted successfully' };
  }
}
