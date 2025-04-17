import {
  Column,
  Entity,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { WorkingUnit } from '../../working-unit/entities/working-unit.entity';
import { Client } from '../../client/entities/client.entity';
import { User } from '../../user/entities/user.entity';
import { BaseEntity } from '@/databases/base.entity';
import { Task } from '../../task/entities/task.entity';
import { ProjectStatus } from '@/enum/project-status.enum';
import { Exclude } from 'class-transformer';

@Entity('projects')
export class Project extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date', nullable: true, name: 'due_date' })
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.ACTIVE,
  })
  status: ProjectStatus;

  @Column({ type: 'integer', nullable: true, name: 'pm_number' })
  pmNumber: number;

  @Column({ type: 'integer', nullable: true, name: 'dev_number' })
  devNumber: number;

  @Column({ type: 'integer', nullable: true, name: 'tech_lead_number' })
  techLeadNumber: number;

  @ManyToOne(() => WorkingUnit, (unit) => unit.projects)
  @JoinColumn({ name: 'working_unit_id' })
  workingUnit: WorkingUnit;

  @ManyToOne(() => Client, (client) => client.projects)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @ManyToMany(() => User, (user) => user.projects, { cascade: true })
  @JoinTable({
    name: 'project_member',
    joinColumn: {
      name: 'project_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  @Exclude()
  members: User[];

  @OneToMany(() => Task, (task) => task.project, { cascade: true })
  @Exclude()
  tasks: Task[];
}
