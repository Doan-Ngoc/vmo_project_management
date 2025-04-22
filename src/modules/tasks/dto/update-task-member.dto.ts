import { IsUUID, IsNotEmpty, IsArray } from 'class-validator';

export class UpdateTaskMemberDto {
  @IsUUID()
  @IsNotEmpty()
  taskId: string;

  @IsArray()
  @IsNotEmpty()
  userIds: string[];
}
