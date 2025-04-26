import { forwardRef, Module } from '@nestjs/common';
import { TaskService } from './services/task.service';
import { TaskController } from './task.controller';
import { ProjectModule } from '../projects/project.module';
import { UserModule } from '../users/user.module';
import { JwtModule } from '../jwt/jwt.module';
import { PermissionModule } from '../permissions/permission.module';
import { TaskCommentModule } from '../task_comments/task-comment.module';
import { TaskRepository } from './repositories/task.repository';
@Module({
  imports: [
    forwardRef(() => ProjectModule),
    forwardRef(() => TaskCommentModule),
    UserModule,
    JwtModule,
    PermissionModule,
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository],
  exports: [TaskService],
})
export class TaskModule {}
