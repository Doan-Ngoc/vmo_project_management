import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class DeleteRoleDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
