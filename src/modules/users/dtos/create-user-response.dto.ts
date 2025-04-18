import { IsString, IsNotEmpty, IsEmail, IsUUID } from 'class-validator';

export class CreateUserResponseDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  employeeName: string;

  @IsUUID()
  @IsNotEmpty()
  roleId: string;

  @IsUUID()
  workingUnitId: string;

  @IsString()
  @IsNotEmpty()
  temporaryPassword: string;
}
