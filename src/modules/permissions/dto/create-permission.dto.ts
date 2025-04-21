import { IsString, IsNotEmpty, MaxLength, IsUUID } from 'class-validator';

export class CreatePermissionDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  path: string;

  @IsString()
  @IsNotEmpty()
  method: string;
}
