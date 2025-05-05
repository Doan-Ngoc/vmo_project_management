import {
  Injectable,
  BadRequestException,
  NotFoundException,
  forwardRef,
  Inject,
  Logger,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Task } from '../entities/task.entity';
import { ProjectService } from '../../projects/services/project.service';
import { UserService } from '../../users/services/user.service';
import { Cron } from '@nestjs/schedule';
import { CronExpression } from '@nestjs/schedule';
import { TaskStatus } from '../../../enum/task-status.enum';
import { AccountStatus } from '../../../enum/account-status.enum';
import { ProjectStatus } from '../../../enum/project-status.enum';
import {
  CreateTaskDto,
  DeleteTaskDto,
  UpdateTaskDataDto,
  UpdateTaskStatusDto,
  UpdateTaskMemberDto,
} from '../dto';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { TaskRepository } from '../repositories/task.repository';
import { User } from '../../users/entities/user.entity';
@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  constructor(
    private readonly taskRepository: TaskRepository,
    @Inject(forwardRef(() => ProjectService))
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
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

  @Cron(CronExpression.EVERY_MINUTE, {})
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

      this.logger.log(`${result.affected} task(s) marked as expired.`);
    } catch (err) {
      this.logger.error('Cron job error:', err);
    }
  }

  async updateTaskMembers(
    updateTaskMemberDto: UpdateTaskMemberDto,
  ): Promise<Task> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { taskId, userIds } = updateTaskMemberDto;

    try {
      // Get task with its project and members
      const task = await this.taskRepository.findOne({
        where: { id: taskId },
        relations: ['project', 'project.members', 'members', 'members.role'],
      });
      if (!task) {
        throw new NotFoundException(`Task with ID ${taskId} not found`);
      }

      // Check task status
      if (
        task.status === TaskStatus.COMPLETED ||
        task.status === TaskStatus.EXPIRED ||
        task.status === TaskStatus.CANCELLED
      ) {
        throw new BadRequestException('Cannot update members of this task');
      }

      //Validate and add members
      let members: User[] = [];
      for (const userId of userIds) {
        const user = await queryRunner.manager.findOne(User, {
          where: { id: userId },
          relations: ['role'],
        });

        if (!user) {
          throw new NotFoundException(`User with ID ${userId} not found`);
        }

        //Check if user account is valid
        if (user.accountStatus !== AccountStatus.ACTIVE) {
          throw new BadRequestException(`User ${userId} account is not active`);
        }
        // Check if user is a member of the project
        if (!task.project.members.some((member) => member.id === user.id)) {
          throw new BadRequestException(
            `User ${userId} is not a member of the project`,
          );
        }

        members.push(user);
      }

      //Save the task
      task.members = members;
      const updatedTask = await queryRunner.manager.save(Task, task);

      await queryRunner.commitTransaction();
      return updatedTask;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  //Update task status
  async updateStatus(
    updateTaskStatusDto: UpdateTaskStatusDto,
    userId: string,
  ): Promise<Task> {
    const { newStatus, taskId } = updateTaskStatusDto;
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
  async updateTaskData(
    updateTaskDataDto: UpdateTaskDataDto,
    userId: string,
  ): Promise<Task> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { taskId } = updateTaskDataDto;
      const task = await queryRunner.manager.findOne(Task, {
        where: { id: taskId },
        relations: ['project', 'members', 'members.role'],
      });

      if (!task) {
        throw new NotFoundException(`Task with ID ${taskId} not found`);
      }

      if (
        task.status === TaskStatus.COMPLETED ||
        task.status === TaskStatus.CANCELLED
      ) {
        throw new BadRequestException(`Cannot update a ${task.status} task`);
      }

      if (
        updateTaskDataDto.dueDate &&
        new Date(updateTaskDataDto.dueDate) < new Date()
      ) {
        throw new BadRequestException('Due date cannot be in the past');
      }

      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
        relations: ['role'],
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const updatedFields = {
        ...(updateTaskDataDto.name && { name: updateTaskDataDto.name }),
        ...(updateTaskDataDto.description !== undefined && {
          description: updateTaskDataDto.description,
        }),
        ...(updateTaskDataDto.dueDate && {
          dueDate: new Date(updateTaskDataDto.dueDate),
        }),
        updatedBy: user,
      };

      Object.assign(task, updatedFields);
      const updatedTask = await queryRunner.manager.save(Task, task);
      await queryRunner.commitTransaction();
      return updatedTask;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  //Delete task
  async delete(deleteTaskDto: DeleteTaskDto, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { deletedReason, taskId } = deleteTaskDto;
      // Get task with its project, members and comments
      const task = await this.taskRepository.findOne({
        where: { id: taskId },
        relations: ['project', 'members', 'comments'],
      });

      if (!task) {
        throw new NotFoundException(`Task with ID ${taskId} not found`);
      }

      // Get the user who is deleting
      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
        relations: ['role'],
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      // Update task properties for soft delete
      task.deletedBy = user;
      task.deleted_reason = deletedReason;
      if (
        task.status === TaskStatus.PENDING ||
        task.status === TaskStatus.IN_PROGRESS
      ) {
        task.status = TaskStatus.CANCELLED;
      }

      // Save the updated task first
      await queryRunner.manager.save(Task, task);

      // Soft delete all comments
      if (task.comments?.length > 0) {
        await queryRunner.manager.softRemove(task.comments);
      }

      // Soft delete the task
      await queryRunner.manager.softRemove(Task, task);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
