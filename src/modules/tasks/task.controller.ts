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
// import { CreateTaskDto } from './dto/create-task.dto';
// import { UpdateTaskDto } from './dto/update-task.dto';
import { Auth } from '../../decorators/auth.decorator';
import { Permissions } from '../../enum/permissions.enum';
import { GetUser } from '../../decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { ProjectMemberGuard } from '../../guards/project-member.guard';
// import { AddTaskMemberDto } from './dto/add-task-member.dto';
// import { RemoveTaskMemberDto } from './dto/remove-task-member.dto';
import { Task } from './entities/task.entity';
// import { DeleteTaskDto } from './dto/delete-task.dto';
// import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TaskMemberGuard } from '@/guards/task-member.guard';
import {
  CreateTaskDto,
  AddTaskMemberDto,
  RemoveTaskMemberDto,
  DeleteTaskDto,
  UpdateTaskStatusDto,
  UpdateTaskDto,
} from './dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Project } from '../projects/entities/project.entity';
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
  ): Promise<Task> {
    return this.taskService.deleteTask(taskId, deleteTaskDto, user.id);
  }
}
