import {
  IsString,
  IsOptional,
  IsDateString,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class UpdateTaskDataDto {
  @IsUUID()
  @IsNotEmpty()
  taskId: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: Date;
}
