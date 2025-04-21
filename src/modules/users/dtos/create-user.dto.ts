import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  employeeName: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsUUID()
  workingUnit: string;
}
