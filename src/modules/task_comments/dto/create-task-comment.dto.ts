import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskCommentDto {
  @IsNotEmpty()
  @IsString()
  taskId: string;
  @IsNotEmpty()
  @IsString()
  content: string;
}
