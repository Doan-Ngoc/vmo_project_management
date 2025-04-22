import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
// import { BaseEntity } from '@/databases/base.entity';
import { BaseEntity } from '../../../databases/base.entity';

@Entity('working_units')
export class WorkingUnit extends BaseEntity {
  @Column({ length: 255, unique: true })
  name: string;

  @OneToMany(() => User, (user) => user.workingUnit)
  members: User[];

  @OneToMany(() => Project, (project) => project.workingUnit)
  projects: Project[];
}
