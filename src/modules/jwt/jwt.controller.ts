import { Controller } from '@nestjs/common';
import { JwtService } from './services/jwt.service';

@Controller('jwt')
export class JwtController {
  constructor(private readonly jwtService: JwtService) {}
}
