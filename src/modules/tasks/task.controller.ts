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
import { TaskMemberGuard } from '@/guards/task-member.guard';
import {
  CreateTaskDto,
  DeleteTaskDto,
  UpdateTaskStatusDto,
  UpdateTaskDto,
  UpdateTaskMemberDto,
} from './dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { ProjectMember } from '@/decorators/project-member.decorator';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  //Create new task
  @Post()
  @ProjectMember(Permissions.CREATE_TASK)
  createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    return this.taskService.createTask(createTaskDto, user.id);
  }

  //Get task by id
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

  @Patch(':taskId/status')
  @ProjectMember(Permissions.UPDATE_TASK_STATUS)
  updateStatus(
    @Param('taskId') taskId: string,
    @Body() updateStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ) {
    return this.taskService.updateStatus(taskId, updateStatusDto, user.id);
  }

  @Patch('/members')
  @ProjectMember(Permissions.UPDATE_TASK_MEMBERS)
  updateTaskMembers(
    @Body() updateTaskMemberDto: UpdateTaskMemberDto,
    @GetUser() user: User,
  ) {
    return this.taskService.updateTaskMembers(updateTaskMemberDto, user.id);
  }

  @Patch(':taskId')
  @UseGuards(TaskMemberGuard)
  @Auth(Permissions.UPDATE_TASK)
  async updateTask(
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.updateTask(taskId, updateTaskDto, user.id);
  }

  @Delete(':taskId')
  @ProjectMember(Permissions.DELETE_TASK)
  async deleteTask(
    @Param('taskId') taskId: string,
    @Body() deleteTaskDto: DeleteTaskDto,
    @GetUser() user: User,
  ) {
    return this.taskService.delete(taskId, deleteTaskDto, user.id);
  }
}
