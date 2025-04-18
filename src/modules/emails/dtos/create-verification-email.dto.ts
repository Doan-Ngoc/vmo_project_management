import { IsString, IsUUID } from 'class-validator';

import { IsEmail } from 'class-validator';

import { IsNotEmpty } from 'class-validator';

export class CreateVerificationEmailDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
