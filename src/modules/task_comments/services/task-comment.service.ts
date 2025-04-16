import { BadRequestException, Injectable } from '@nestjs/common';
import { TaskComment } from '../entities/task-comment.entity';
import { TaskService } from '../../task/services/task.service';
import { UserService } from '../../user/services/user.service';
import { CreateTaskCommentDto } from '../dto/create-task-comment.dto';
import { TaskCommentRepository } from '../repositories/task-comment.repository';
import { TaskStatus } from '@/enum/task-status.enum';

@Injectable()
export class TaskCommentService {
  constructor(
    private readonly taskService: TaskService,
    private readonly userService: UserService,
    private readonly taskCommentRepository: TaskCommentRepository,
  ) {}

  async create(
    createTaskCommentDto: CreateTaskCommentDto,
    userId: string,
  ): Promise<TaskComment> {
    try {
      const { taskId, content } = createTaskCommentDto;
      const task = await this.taskService.getById(taskId);
      if (
        task.status === TaskStatus.COMPLETED ||
        task.status === TaskStatus.CANCELLED
      ) {
        throw new BadRequestException(
          `You can't post comments on a ${task.status} task`,
        );
      }
      const createdBy = await this.userService.getById(userId);

      const taskComment = await this.taskCommentRepository.create({
        content,
        task,
        createdBy,
      });

      return await this.taskCommentRepository.save(taskComment);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
