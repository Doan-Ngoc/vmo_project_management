import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Permission } from '@/modules/permission/entities/permission.entity';
import { PermissionSeederService } from './services/permission-seeder.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PermissionModule } from '@/modules/permission/permission.module';
import typeorm from '../typeorm';
import * as path from 'path';

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
  ],
  providers: [PermissionSeederService],
  exports: [PermissionSeederService],
})
export class SeedsModule {}
