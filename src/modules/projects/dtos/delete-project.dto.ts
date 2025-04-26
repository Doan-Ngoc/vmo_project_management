import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteProjectDto {
  @IsString()
  @IsNotEmpty()
  deletedReason: string;

  @IsString()
  @IsNotEmpty()
  projectId: string;
}
