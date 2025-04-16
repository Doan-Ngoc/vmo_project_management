import { Module } from '@nestjs/common';
import { TaskCommentService } from './services/task-comment.service';
import { TaskCommentController } from './task-comment.controller';
import { TaskCommentRepository } from './repositories/task-comment.repository';
import { TaskModule } from '../task/task.module';
import { UserModule } from '../user/user.module';
import { JwtModule } from '../jwt/jwt.module';
import { PermissionModule } from '../permission/permission.module';
import { ProjectModule } from '../project/project.module';
@Module({
  imports: [TaskModule, UserModule, JwtModule, PermissionModule, ProjectModule],
  controllers: [TaskCommentController],
  providers: [TaskCommentService, TaskCommentRepository],
})
export class TaskCommentModule {}
