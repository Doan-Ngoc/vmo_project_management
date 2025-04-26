import { IsUUID, IsNotEmpty, IsEnum } from 'class-validator';
import { ProjectStatus } from '@/enum/project-status.enum';

export class UpdateProjectStatusDto {
  @IsUUID()
  @IsNotEmpty()
  projectId: string;

  @IsEnum(ProjectStatus)
  @IsNotEmpty()
  status: ProjectStatus;
}
