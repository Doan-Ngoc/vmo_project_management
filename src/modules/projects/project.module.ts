import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectService } from './services/project.service';
import { ProjectController } from './project.controller';
import { Project } from './entities/project.entity';
import { WorkingUnit } from '../working-units/entities/working-unit.entity';
import { Client } from '../clients/entities/client.entity';
import { ProjectRepository } from './repositories/project.repository';
import { JwtModule } from '../jwt/jwt.module';
import { PermissionModule } from '../permissions/permission.module';
import { WorkingUnitModule } from '../working-units/working-unit.module';
import { ClientModule } from '../clients/client.module';
import { UserModule } from '../users/user.module';
import { AuthModule } from '../auth/auth.module';
import { TaskModule } from '../tasks/task.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    forwardRef(() => TaskModule),
    JwtModule,
    PermissionModule,
    WorkingUnitModule,
    ClientModule,
    UserModule,
    AuthModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepository],
  exports: [ProjectService],
})
export class ProjectModule {}
