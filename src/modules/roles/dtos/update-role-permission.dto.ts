import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateRolePermissionDto {
  @IsUUID()
  @IsNotEmpty()
  roleId: string;

  @IsArray()
  @IsUUID('4', { each: true })
  permissionIds: string[];
}
