import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Permission } from '@/modules/permissions/entities/permission.entity';
import { SeederService } from './services/seeder.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PermissionModule } from '@/modules/permissions/permission.module';
import typeorm from '../typeorm';
import * as path from 'path';
import { RoleModule } from '@/modules/roles/role.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/users/user.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
      envFilePath: path.join(
        __dirname,
        'configs',
        `.env-${process.env.NODE_ENV || 'dev'}`,
      ),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm') as TypeOrmModuleOptions,
    }),
    PermissionModule,
    RoleModule,
    AuthModule,
    UserModule,
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeedsModule {}
