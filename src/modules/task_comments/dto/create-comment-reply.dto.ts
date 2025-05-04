import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentReplyDto {
  @IsNotEmpty()
  @IsString()
  commentId: string;
  @IsNotEmpty()
  @IsString()
  content: string;
}
