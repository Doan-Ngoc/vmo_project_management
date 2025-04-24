import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskComment } from '../entities/task-comment.entity';
import { TaskService } from '../../tasks/services/task.service';
import { UserService } from '../../users/services/user.service';
import { CreateTaskCommentDto } from '../dto/create-task-comment.dto';
import { TaskCommentRepository } from '../repositories/task-comment.repository';
import { TaskStatus } from '@/enum/task-status.enum';
import { UpdateTaskCommentDto } from '../dto/update-task-comment.dto';

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
  }

  async getByTask(taskId: string): Promise<TaskComment[]> {
    return await this.taskCommentRepository.find({
      where: { task: { id: taskId } },
      relations: ['task', 'createdBy'],
    });
  }

  async getById(commentId: string): Promise<TaskComment> {
    const comment = await this.taskCommentRepository.findOne({
      where: {
        id: commentId,
      },
      relations: ['task', 'createdBy'],
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (!comment.task) {
      throw new NotFoundException(
        'Task associated with this comment not found',
      );
    }
    if (comment.task.deletedAt) {
      throw new NotFoundException(
        'Task associated with this comment has been deleted',
      );
    }
    return comment;
  }

  async update(
    commentId: string,
    updateTaskCommentDto: UpdateTaskCommentDto,
    userId: string,
  ): Promise<TaskComment> {
    const { content } = updateTaskCommentDto;
    const comment = await this.getById(commentId);

    const task = await this.taskService.getById(comment.task.id);
    if (
      task.status === TaskStatus.COMPLETED ||
      task.status === TaskStatus.CANCELLED
    ) {
      throw new BadRequestException(
        `You can't update comments on a ${task.status} task`,
      );
    }
    comment.content = content;
    return await this.taskCommentRepository.save(comment);
  }

  async delete(commentId: string, userId: string): Promise<void> {
    const comment = await this.getById(commentId);
    const task = await this.taskService.getById(comment.task.id);
    if (
      task.status === TaskStatus.COMPLETED ||
      task.status === TaskStatus.CANCELLED
    ) {
      throw new BadRequestException(
        `You can't delete comments on a ${task.status} task`,
      );
    }

    await this.taskCommentRepository.softRemove(comment);
  }
}
