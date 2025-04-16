import { Module } from '@nestjs/common';
import { TaskCommentService } from './services/task-comment.service';
import { TaskCommentController } from './task-comment.controller';
import { TaskModule } from '../task/task.module';
import { UserModule } from '../user/user.module';
import { JwtModule } from '../jwt/jwt.module';
import { PermissionModule } from '../permission/permission.module';
@Module({
  imports: [TaskModule, UserModule, JwtModule, PermissionModule],
  controllers: [TaskCommentController],
  providers: [TaskCommentService],
  exports: [TaskCommentService],
})
export class TaskCommentModule {}
