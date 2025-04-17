import { IsArray, IsUUID } from 'class-validator';

export class UpdateRolePermissionDto {
  @IsArray()
  @IsUUID('4', { each: true })
  permissionIds: string[];
}
