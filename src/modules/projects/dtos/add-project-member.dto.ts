import {
  IsUUID,
  IsString,
  IsDateString,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class AddProjectMemberDto {
  @IsUUID()
  @IsNotEmpty()
  projectId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
