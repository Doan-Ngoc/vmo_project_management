import { IsUUID, IsNotEmpty } from 'class-validator';

export class AddTaskMemberDto {
  @IsUUID()
  @IsNotEmpty()
  taskId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
