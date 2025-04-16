import { IsUUID, IsNotEmpty, IsString } from 'class-validator';

export class DeleteTaskDto {
  @IsString()
  @IsNotEmpty()
  deletedReason: string;
}
