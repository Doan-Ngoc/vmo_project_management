import {
  IsUUID,
  IsString,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  workingUnitId: string;

  @IsUUID()
  clientId: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsNumber()
  @IsOptional()
  pmNumber?: number;

  @IsNumber()
  @IsOptional()
  devNumber?: number;

  @IsNumber()
  @IsOptional()
  techLeadNumber?: number;
}
