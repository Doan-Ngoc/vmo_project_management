import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from './services/file.service';
import { FilesController } from '../../modules/files/file.controller';
import { RoleModule } from '../../modules/roles/role.module';
import { WorkingUnitModule } from '../../modules/working-units/working-unit.module';

@Module({
  imports: [RoleModule, WorkingUnitModule],
  controllers: [FilesController],
  providers: [FileService],
  exports: [FileService],
})
export class FilesModule {}
