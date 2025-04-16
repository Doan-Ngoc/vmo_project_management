import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from './services/file.service';
import { FilesController } from './file.controller';
import { RoleModule } from '../role/role.module';
import { WorkingUnitModule } from '../working-unit/working-unit.module';

@Module({
  imports: [RoleModule, WorkingUnitModule],
  controllers: [FilesController],
  providers: [FileService],
  exports: [FileService],
})
export class FilesModule {}
