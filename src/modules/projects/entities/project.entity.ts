import {
  Column,
  Entity,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { WorkingUnit } from '../../working-units/entities/working-unit.entity';
import { Client } from '../../clients/entities/client.entity';
import { User } from '../../users/entities/user.entity';
import { BaseEntity } from '../../../databases/base.entity';
import { Task } from '../../tasks/entities/task.entity';
import { ProjectStatus } from '../../../enum/project-status.enum';
import { Exclude } from 'class-transformer';

@Entity('projects')
export class Project extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
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

  @ManyToOne(() => User)
  @JoinColumn({ name: 'deleted_by' })
  deletedBy: User;

  @Column({ type: 'text', nullable: true })
  deleted_reason: string;

  @ManyToMany(() => User, (user) => user.projects)
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
  members: User[];

  @OneToMany(() => Task, (task) => task.project)
  @Exclude()
  tasks: Task[];
}
