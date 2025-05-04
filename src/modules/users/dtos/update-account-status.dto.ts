import { AccountStatus } from '../../../enum/account-status.enum';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateAccountStatusDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsString()
  status: AccountStatus;
}
