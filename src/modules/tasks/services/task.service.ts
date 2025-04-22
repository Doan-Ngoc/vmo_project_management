import {
  Injectable,
  BadRequestException,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { CreateTaskDto } from '../dto/create-task.dto';
import { Task } from '../entities/task.entity';
import { ProjectService } from '../../projects/services/project.service';
import { UserService } from '../../users/services/user.service';
import { Cron } from '@nestjs/schedule';
import { CronExpression } from '@nestjs/schedule';
import { TaskStatus } from '@/enum/task-status.enum';
// import { AddTaskMemberDto } from '../dto/add-task-member.dto';
import { AccountStatus } from '../../../enum/account-status.enum';
import { ProjectStatus } from '../../../enum/project-status.enum';
// import { RemoveTaskMemberDto } from '../dto/remove-task-member.dto';
// import { DeleteTaskDto } from '../dto/delete-task.dto';
// import { UpdateTaskStatusDto } from '../dto/update-task-status.dto';
import {
  CreateTaskDto,
  AddTaskMemberDto,
  RemoveTaskMemberDto,
  DeleteTaskDto,
  UpdateTaskDto,
  UpdateTaskStatusDto,
} from '../dto';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Project } from '@/modules/projects/entities/project.entity';
import { TaskRepository } from '../repositories/task.repository';
@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    @Inject(forwardRef(() => ProjectService))
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
  ) {}

  async getById(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['project', 'members', 'members.role'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  //Get all tasks of a project
  async getAllTasks(
    projectId: string,
    options: IPaginationOptions,
    query?: string,
  ): Promise<Pagination<Task>> {
    const project = await this.projectService.getById(projectId);
    const queryBuilder = this.taskRepository.createQueryBuilder('task');
    queryBuilder.where('task.project_id = :projectId', { projectId });
    if (query) {
      queryBuilder.andWhere('LOWER(task.name) LIKE :query', {
        query: `%${query.toLowerCase()}%`,
      });
    }
    queryBuilder.orderBy('task.createdAt', 'DESC');

    return paginate<Task>(queryBuilder, options);
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    userId: string,
  ): Promise<Task> {
    const { projectId, dueDate, ...taskData } = createTaskDto;
    // Check if due date is in the past
    if (dueDate && new Date(dueDate) < new Date()) {
      throw new BadRequestException('Due date cannot be in the past');
    }

    const project = await this.projectService.getById(projectId);
    if (project.status !== ProjectStatus.ACTIVE) {
      throw new BadRequestException(
        'You can only add task to an active project',
      );
    }
    const user = await this.userService.getById(userId);

    // Create the task
    const newTask = this.taskRepository.create({
      ...taskData,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      project,
      createdBy: user,
    });

    return await this.taskRepository.save(newTask);
  }

  //Every midnight: Update task status to expired if due date is passed
  @Cron(CronExpression.EVERY_MINUTE, {
    // timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleExpiredTasks() {
    try {
      const now = new Date();

      const result = await this.taskRepository
        .createQueryBuilder()
        .update(Task)
        .set({ status: TaskStatus.EXPIRED })
        .where('dueDate < :now', { now })
        .andWhere(`status = :status`, {
          status: TaskStatus.IN_PROGRESS,
        })
        .execute();

      console.log(`${result.affected} task(s) marked as expired.`);
    } catch (err) {
      console.error('Cron job error:', err);
    }
  }

  //Add member to task
  async addMember(addTaskMemberDto: AddTaskMemberDto): Promise<Task> {
    const { taskId, userId } = addTaskMemberDto;

    // Get task with its project and members
    const task = await this.taskRepository.findOne({
      where: {
        id: taskId,
      },
      relations: ['project', 'project.members', 'members', 'members.role'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    // Check task status
    if (
      task.status === TaskStatus.COMPLETED ||
      task.status === TaskStatus.EXPIRED
    ) {
      throw new BadRequestException(
        'Cannot add members to a completed or expired task',
      );
    }

    const user = await this.userService.getById(userId);
    //Check if user account is active
    if (user.accountStatus !== AccountStatus.ACTIVE) {
      throw new BadRequestException('User account is not active');
    }
    // Check if user is already assigned to the task
    if (task.members.some((member) => member.id === user.id)) {
      throw new BadRequestException('User is already assigned to this task');
    }

    // Check if user is a member of the project
    if (!task.project.members.some((member) => member.id === user.id)) {
      throw new BadRequestException('User is not a member of the project');
    }

    // Add the member
    task.members = [...task.members, user];
    return await this.taskRepository.save(task);
  }

  async removeMember(removeTaskMemberDto: RemoveTaskMemberDto): Promise<Task> {
    const { taskId, userId } = removeTaskMemberDto;
    const task = await this.getById(taskId);

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    // Check task status
    if (
      task.status === TaskStatus.COMPLETED ||
      task.status === TaskStatus.EXPIRED
    ) {
      throw new BadRequestException(
        'Cannot remove members from a completed or expired task',
      );
    }

    const user = await this.userService.getById(userId);

    // Check if user is a member of the task
    const isMember = task.members.some((member) => member.id === user.id);
    if (!isMember) {
      throw new BadRequestException('User is not a member of this task');
    }

    // Remove the member
    task.members = task.members.filter((member) => member.id !== user.id);
    return await this.taskRepository.save(task);
  }

  //Update task status
  async updateStatus(
    taskId: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
    userId: string,
  ): Promise<Task> {
    const { newStatus } = updateTaskStatusDto;
    const task = await this.getById(taskId);
    const user = await this.userService.getById(userId);

    if (newStatus === task.status) {
      throw new BadRequestException(
        'New status is the same as the current status',
      );
    }

    task.status = newStatus;
    task.updatedBy = user;

    return await this.taskRepository.save(task);
  }

  //Update task
  async updateTask(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<Task> {
    const task = await this.getById(taskId);
    if (
      task.status === TaskStatus.COMPLETED ||
      task.status === TaskStatus.CANCELLED
    ) {
      throw new BadRequestException(`Cannot update a ${task.status} task`);
    }
    // Validate due date if provided
    if (updateTaskDto.dueDate && new Date(updateTaskDto.dueDate) < new Date()) {
      throw new BadRequestException('Due date cannot be in the past');
    }

    // Get the user who is updating
    const user = await this.userService.getById(userId);

    // Update the fields
    if (updateTaskDto.name) {
      task.name = updateTaskDto.name;
    }
    //Allow empty string for description
    if (updateTaskDto.description !== undefined) {
      task.description = updateTaskDto.description;
    }
    if (updateTaskDto.dueDate) {
      task.dueDate = new Date(updateTaskDto.dueDate);
    }

    // Set who updated it
    task.updatedBy = user;

    return await this.taskRepository.save(task);
  }

  //Delete task
  async deleteTask(
    taskId: string,
    deleteTaskDto: DeleteTaskDto,
    userId: string,
  ): Promise<Task> {
    const { deletedReason } = deleteTaskDto;
    // Get task with its project and members
    const task = await this.getById(taskId);

    // Get the user who is deleting
    const user = await this.userService.getById(userId);

    // Update task properties for soft delete
    task.deletedBy = user;
    task.deleted_reason = deletedReason;
    if ((task.status = TaskStatus.PENDING || TaskStatus.IN_PROGRESS)) {
      task.status = TaskStatus.CANCELLED;
    }
    await this.taskRepository.save(task);

    // Soft delete using TypeORM
    return await this.taskRepository.softRemove(task);
  }
}
