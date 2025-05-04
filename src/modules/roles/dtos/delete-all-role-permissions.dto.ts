import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class DeleteRolePermissionDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
