import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './services/task.service';
import { TaskController } from './task.controller';
import { Task } from './entities/task.entity';
import { ProjectModule } from '../projects/project.module';
import { UserModule } from '../users/user.module';
import { JwtModule } from '../jwt/jwt.module';
import { PermissionModule } from '../permissions/permission.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    forwardRef(() => ProjectModule),
    UserModule,
    JwtModule,
    PermissionModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
