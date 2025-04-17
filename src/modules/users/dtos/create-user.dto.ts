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
  password: string;

  @IsString()
  @IsNotEmpty()
  employeeName: string;

  @IsUUID()
  @IsNotEmpty()
  roleId: string;

  @IsUUID()
  workingUnitId: string;

  @IsString()
  @IsOptional()
  profilePicture?: string;
}
