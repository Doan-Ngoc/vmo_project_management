import { forwardRef, Module } from '@nestjs/common';
import { TaskCommentService } from './services/task-comment.service';
import { TaskCommentController } from './task-comment.controller';
import { TaskModule } from '../tasks/task.module';
import { UserModule } from '../users/user.module';
import { JwtModule } from '../jwt/jwt.module';
import { PermissionModule } from '../permissions/permission.module';
import { ProjectModule } from '../projects/project.module';
import { TaskCommentRepository } from './repositories/task-comment.repository';
import { ProjectMemberGuard } from '../../guards/project-member.guard';
@Module({
  imports: [
    forwardRef(() => TaskModule),
    forwardRef(() => ProjectModule),
    UserModule,
    JwtModule,
    PermissionModule,
  ],
  controllers: [TaskCommentController],
  providers: [TaskCommentService, TaskCommentRepository],
  exports: [TaskCommentService],
})
export class TaskCommentModule {}
