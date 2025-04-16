import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtService } from '../modules/jwt/services/jwt.service';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '@/decorators/auth.decorator';
import { PermissionService } from 'src/modules/permission/services/permission.service';
import { AccountType } from '@/enum/account-type.enum';
import { UserService } from '@/modules/user/services/user.service';
import { AccountStatus } from '@/enum/account-status.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private reflector: Reflector,
    private permissionService: PermissionService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // Authentication check
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    const decode = this.jwtService.verify(
      token,
      this.configService.get('JWT_ACCESS_KEY') as string,
    );
    const user = await this.userService.getById(decode.id);

    request.user = user;

    //Only allow active users
    if (user.accountStatus !== AccountStatus.ACTIVE) return false;

    //Bypass authorization check for admin
    if (user.accountType === AccountType.ADMIN) {
      return true;
    }
    // Authorization check
    const requiredPermission = this.reflector.get<string>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );
    if (!requiredPermission) {
      return true;
    }

    const allowedRoleIds =
      await this.permissionService.getPermissionRoles(requiredPermission);
    const userRoleId = user.role.id;
    if (!allowedRoleIds.includes(userRoleId)) {
      throw new ForbiddenException();
    }

    return true;
  }
  // }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
