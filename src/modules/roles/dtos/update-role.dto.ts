import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateRoleDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  name: string;
}
