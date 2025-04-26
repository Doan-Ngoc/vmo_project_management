import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteTaskCommentDto {
  @IsUUID()
  @IsNotEmpty()
  commentId: string;
}
