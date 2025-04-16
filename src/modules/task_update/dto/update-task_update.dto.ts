import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskUpdateDto } from './create-task_update.dto';

export class UpdateTaskUpdateDto extends PartialType(CreateTaskUpdateDto) {}
