import { IsNotEmpty } from 'class-validator';

export class AuthLogInDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
}
