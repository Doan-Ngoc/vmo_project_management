import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  [key: string]: any;
}

@Injectable()
export class JwtService {
  constructor() {}

  sign(payload: object, secretKey: string, options?: jwt.SignOptions): string {
    return jwt.sign(payload, secretKey, options);
  }

  verify(token: string, secretKey: string): JwtPayload {
    try {
      return jwt.verify(token, secretKey) as JwtPayload;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
