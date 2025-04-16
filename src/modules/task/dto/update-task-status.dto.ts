import { IsNotEmpty, IsEnum } from 'class-validator';
import { TaskStatus } from '@/enum/task-status.enum';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  @IsNotEmpty()
  newStatus: TaskStatus;
}
