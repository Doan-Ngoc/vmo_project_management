import { Column, Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../databases/base.entity';
import { Task } from '../../tasks/entities/task.entity';
import { User } from '../../users/entities/user.entity';

@Entity('task_comments')
export class TaskComment extends BaseEntity {
  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => Task, (task) => task.comments)
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column({ type: 'text', nullable: true })
  path: string;

  @Column()
  level: number;

  @ManyToOne(() => TaskComment)
  @JoinColumn({ name: 'parent_id' })
  parent: TaskComment;

  @OneToMany(() => TaskComment, (comment) => comment.parent)
  replies: TaskComment[];
}
