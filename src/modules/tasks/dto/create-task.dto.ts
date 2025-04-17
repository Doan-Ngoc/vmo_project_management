import {
  IsUUID,
  IsString,
  IsDateString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateTaskDto {
  @IsUUID()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}
