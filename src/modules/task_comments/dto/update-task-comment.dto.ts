import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateTaskCommentDto {
  @IsNotEmpty()
  @IsString()
  content: string;
}
