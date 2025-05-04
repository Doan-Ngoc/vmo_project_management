import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Permission } from '../../modules/permissions/entities/permission.entity';
import { SeedsService } from './services/seeds.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PermissionModule } from '../../modules/permissions/permission.module';
import typeormSeed from '../typeorm/typeorm.seed';
import * as path from 'path';
import { RoleModule } from '../../modules/roles/role.module';
import { AuthModule } from '../../modules/auth/auth.module';
import { UserModule } from '../../modules/users/user.module';
import { RolePermissionSeedData } from './data/role-permissions-seed-data';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeormSeed],
      envFilePath: path.join(
        __dirname,
        `../../../configs/.env-${process.env.NODE_ENV || 'dev'}`,
      ),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm.seed') as TypeOrmModuleOptions,
    }),
    PermissionModule,
    RoleModule,
    AuthModule,
    UserModule,
    RoleModule,
  ],
  providers: [SeedsService, RolePermissionSeedData],
  exports: [SeedsService],
})
export class SeedsModule {}
