import { Injectable } from '@nestjs/common';
import { TaskRepository } from '../../task/repositories/task.repository';
import { TaskUpdate } from '../entities/task-update.entity';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class TaskUpdateService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async createTaskUpdate(
    taskId: string,
    content: string,
    createdBy: User,
  ): Promise<TaskUpdate> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['updates'],
    });

    if (!task) {
      throw new Error('Task not found');
    }

    const taskUpdate = new TaskUpdate();
    taskUpdate.content = content;
    taskUpdate.task = task;
    taskUpdate.createdBy = createdBy;

    task.updates = task.updates || [];
    task.updates.push(taskUpdate);

    await this.taskRepository.save(task);

    return taskUpdate;
  }
}
