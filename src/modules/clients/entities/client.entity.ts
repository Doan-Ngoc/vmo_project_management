import { BaseEntity } from '@/databases/base.entity';
import { Project } from '../../projects/entities/project.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('clients')
export class Client extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @OneToMany(() => Project, (project) => project.client)
  projects: Project[];
}
