import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateWorkingUnitDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
