import { Module } from '@nestjs/common';
import { TaskUpdateService } from './services/task-update.service';
import { TaskUpdateController } from './task-update.controller';

@Module({
  controllers: [TaskUpdateController],
  providers: [TaskUpdateService],
})
export class TaskUpdateModule {}
