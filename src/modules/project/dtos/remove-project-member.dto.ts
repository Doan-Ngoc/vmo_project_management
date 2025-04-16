import { IsUUID, IsNotEmpty } from 'class-validator';

export class RemoveProjectMemberDto {
  @IsUUID()
  @IsNotEmpty()
  projectId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
