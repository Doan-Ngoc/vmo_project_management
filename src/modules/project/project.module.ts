import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectService } from './services/project.service';
import { ProjectController } from './project.controller';
import { Project } from './entities/project.entity';
import { WorkingUnit } from '../working-unit/entities/working-unit.entity';
import { Client } from '../client/entities/client.entity';
import { ProjectRepository } from './repositories/project.repository';
import { JwtModule } from '../jwt/jwt.module';
import { PermissionModule } from '../permission/permission.module';
import { WorkingUnitModule } from '../working-unit/working-unit.module';
import { ClientModule } from '../client/client.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { TaskModule } from '../task/task.module';

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
