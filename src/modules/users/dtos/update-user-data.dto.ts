import { IsString, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateUserDataDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  employeeName?: string;
}
