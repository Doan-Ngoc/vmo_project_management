import { forwardRef, Module } from '@nestjs/common';
import { WorkingUnitService } from './services/working-unit.service';
import { WorkingUnitController } from './working-unit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkingUnit } from './entities/working-unit.entity';
import { WorkingUnitRepository } from './repositories/working-unit.repository';
import { PermissionModule } from '../permissions/permission.module';
import { JwtModule } from '../jwt/jwt.module';
import { UserModule } from '../users/user.module';
@Module({
  imports: [
    JwtModule,
    forwardRef(() => UserModule),
    forwardRef(() => PermissionModule),
  ],
  controllers: [WorkingUnitController],
  providers: [WorkingUnitService, WorkingUnitRepository],
  exports: [WorkingUnitService],
})
export class WorkingUnitModule {}
