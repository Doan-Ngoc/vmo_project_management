import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateTaskCommentDto {
  @IsUUID()
  @IsNotEmpty()
  commentId: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
