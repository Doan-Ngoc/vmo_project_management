import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProjectMemberDto {
  @IsUUID()
  @IsNotEmpty()
  projectId: string;

  @IsArray()
  @IsNotEmpty()
  userIds: string[];
}
