import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskComment } from '../entities/task-comment.entity';
import { TaskService } from '../../tasks/services/task.service';
import { UserService } from '../../users/services/user.service';
import {
  CreateTaskCommentDto,
  UpdateTaskCommentDto,
  DeleteTaskCommentDto,
  CreateCommentReplyDto,
} from '../dto';
import { TaskCommentRepository } from '../repositories/task-comment.repository';
import { TaskStatus } from '../../../enum/task-status.enum';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { DataSource, Like } from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';

@Injectable()
export class TaskCommentService {
  constructor(
    private readonly taskService: TaskService,
    private readonly userService: UserService,
    private readonly taskCommentRepository: TaskCommentRepository,
    private readonly dataSource: DataSource,
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
      level: 0,
      path: '',
    });

    return await this.taskCommentRepository.save(taskComment);
  }

  async createReply(
    createCommentReplyDto: CreateCommentReplyDto,
    userId: string,
  ): Promise<TaskComment> {
    const { commentId, content } = createCommentReplyDto;
    const parentComment = await this.getById(commentId);
    const task = await this.taskService.getById(parentComment.task.id);

    if (
      task.status === TaskStatus.COMPLETED ||
      task.status === TaskStatus.CANCELLED
    ) {
      throw new BadRequestException(
        `You can't reply to comments on a ${task.status} task`,
      );
    }

    const createdBy = await this.userService.getById(userId);

    const newComment = this.taskCommentRepository.create({
      content,
      task,
      createdBy,
      parent: parentComment,
      level: parentComment.level + 1,
      path: parentComment.path
        ? `${parentComment.path}.${parentComment.id}`
        : parentComment.id,
    });

    return await this.taskCommentRepository.save(newComment);
  }

  //Get comments of a task (only root comments, with pagination)
  async getTaskComments(
    taskId: string,
    options: IPaginationOptions,
  ): Promise<Pagination<TaskComment>> {
    const queryBuilder = this.taskCommentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.createdBy', 'user')
      .where('comment.task_id = :taskId', { taskId })
      .andWhere('comment.level = :level', { level: 0 });
    queryBuilder.orderBy('comment.createdAt', 'DESC');

    return paginate<TaskComment>(queryBuilder, options);
  }

  async getById(commentId: string): Promise<TaskComment> {
    const comment = await this.taskCommentRepository.findOne({
      where: {
        id: commentId,
      },
      relations: ['task', 'createdBy', 'replies', 'replies.createdBy'],
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (!comment.task) {
      throw new NotFoundException(
        'Task associated with this comment not found',
      );
    }
    return comment;
  }

  async getReplies(
    commentId: string,
    options: IPaginationOptions,
  ): Promise<Pagination<TaskComment>> {
    const queryBuilder = this.taskCommentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.createdBy', 'user')
      .where('comment.parent_id = :commentId', { commentId }) // Only get direct replies
      .orderBy('comment.createdAt', 'DESC');

    return paginate<TaskComment>(queryBuilder, options);
  }

  async update(
    updateTaskCommentDto: UpdateTaskCommentDto,
  ): Promise<TaskComment> {
    const { content, commentId } = updateTaskCommentDto;
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

  async delete(deleteTaskCommentDto: DeleteTaskCommentDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { commentId } = deleteTaskCommentDto;

      const comment = await queryRunner.manager.findOne(TaskComment, {
        where: { id: commentId },
        relations: ['task'],
      });

      if (!comment) {
        throw new NotFoundException('Comment not found');
      }

      const task = await queryRunner.manager.findOne(Task, {
        where: { id: comment.task.id },
      });
      if (!task) {
        throw new NotFoundException(
          'Task associated with this comment not found',
        );
      }
      if (
        task.status === TaskStatus.COMPLETED ||
        task.status === TaskStatus.CANCELLED
      ) {
        throw new BadRequestException(
          `You can't delete comments on a ${task.status} task`,
        );
      }

      //Find all descendants of the comment
      const allReplies = await queryRunner.manager.find(TaskComment, {
        where: {
          path:
            comment.path === ''
              ? Like(`${commentId}%`) // For root comments
              : Like(`${comment.path}.${commentId}%`), // For nested comments
        },
      });
      // Soft remove all descendant replies first
      if (allReplies.length > 0) {
        await queryRunner.manager.softRemove(allReplies);
      }
      // Then soft remove the comment
      await queryRunner.manager.softRemove(comment);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
