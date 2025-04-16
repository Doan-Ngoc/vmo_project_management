import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Task } from '../../task/entities/task.entity';
import { User } from '../../user/entities/user.entity';
import { BaseEntity } from '@/databases/base.entity';

@Entity('task_updates')
export class TaskUpdate extends BaseEntity {
  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => Task, (task) => task.updates, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @ManyToOne(() => User, {
    nullable: false,
  })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;
}
