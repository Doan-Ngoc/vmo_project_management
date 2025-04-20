import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '@/modules/users/services/user.service';
import { AccountType } from '@/enum/account-type.enum';

@Injectable()
export class WorkingUnitMemberGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    // Bypass authorization check for admin
    if (user.accountType === AccountType.ADMIN) {
      return true;
    }
    // Check if users are from the same working unit
    const workingUnitId =
      request.params?.workingUnitId || request.body?.workingUnitId;
    if (user.workingUnit.id !== workingUnitId) {
      return false;
    }

    return true;
  }
}
