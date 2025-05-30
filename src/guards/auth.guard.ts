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
import { PERMISSIONS_KEY } from '../decorators/auth.decorator';
import { PermissionService } from '../modules/permissions/services/permission.service';
import { AccountType } from '../enum/account-type.enum';
import { UserService } from '../modules/users/services/user.service';
import { AccountStatus } from '../enum/account-status.enum';

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
      this.configService.getOrThrow('JWT_ACCESS_KEY') as string,
    );

    const user = await this.userService.getById(decode.id);

    //Check if the token has been issued before a password change
    const tokenIssuedAt = new Date(decode.iat * 1000);
    if (tokenIssuedAt < user.passwordChangedAt) {
      throw new UnauthorizedException(
        'Password has been changed. Please login again.',
      );
    }

    //Add user to request
    request.user = user;

    //Only allow active users
    if (user.accountStatus !== AccountStatus.ACTIVE) return false;

    //Bypass authorization check for admin
    if (user.accountType === AccountType.ADMIN) {
      return true;
    }
    // Authorization check
    const requiredPermission = this.reflector.getAllAndOverride<string>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermission) {
      return true;
    }
    const allowedRoleIds =
      await this.permissionService.getPermissionRoles(requiredPermission);
    const userRoleId = user.role.id;
    if (!allowedRoleIds.includes(userRoleId)) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
