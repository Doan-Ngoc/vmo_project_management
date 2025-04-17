import { IsUUID, IsNotEmpty } from 'class-validator';

export class RemoveTaskMemberDto {
  @IsUUID()
  @IsNotEmpty()
  taskId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
