import { Module } from '@nestjs/common';
import { ClientService } from './services/client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { ClientRepository } from './repositories/client.repository';
import { JwtModule } from '../jwt/jwt.module';
import { PermissionModule } from '../permission/permission.module';
import { UserModule } from '../user/user.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Client]),
    JwtModule,
    PermissionModule,
    UserModule,
  ],
  controllers: [ClientController],
  providers: [ClientService, ClientRepository],
  exports: [ClientService],
})
export class ClientModule {}
