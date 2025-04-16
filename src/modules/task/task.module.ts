import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './services/task.service';
import { TaskController } from './task.controller';
import { Task } from './entities/task.entity';
import { ProjectModule } from '../project/project.module';
import { UserModule } from '../user/user.module';
import { JwtModule } from '../jwt/jwt.module';
import { PermissionModule } from '../permission/permission.module';
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
