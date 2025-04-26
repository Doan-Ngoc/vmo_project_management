import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class DeleteTaskDto {
  @IsUUID()
  @IsNotEmpty()
  taskId: string;

  @IsString()
  @IsNotEmpty()
  deletedReason: string;
}
