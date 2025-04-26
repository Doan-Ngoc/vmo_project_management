import { Module } from '@nestjs/common';
import { ClientService } from './services/client.service';
import { ClientController } from './client.controller';
import { ClientRepository } from './repositories/client.repository';
import { JwtModule } from '../jwt/jwt.module';
import { PermissionModule } from '../permissions/permission.module';
import { UserModule } from '../users/user.module';
@Module({
  imports: [JwtModule, PermissionModule, UserModule],
  controllers: [ClientController],
  providers: [ClientService, ClientRepository],
  exports: [ClientService],
})
export class ClientModule {}
