import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateProjectMemberDto {
  @IsUUID()
  @IsNotEmpty()
  projectId: string;

  @IsArray()
  @IsNotEmpty()
  userIds: string[];
}
