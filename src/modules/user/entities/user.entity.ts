import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { WorkingUnit } from '../../working-unit/entities/working-unit.entity';
import { Role } from '../../role/entities/role.entity';
import { AccountStatus } from '../../../enum/account-status.enum';
import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { AccountType } from '../../../enum/account-type.enum';
import { Project } from '../../project/entities/project.entity';
import { BaseEntity } from '@/databases/base.entity';
import { Task } from '@/modules/task/entities/task.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  @IsEmail()
  email: string;

  @Column({ type: 'varchar', length: 255, name: 'hashed_password' })
  @Exclude()
  hashedPassword: string;

  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column({ type: 'varchar', length: 255, name: 'employee_name' })
  employeeName: string;

  @Column({
    type: 'enum',
    enum: AccountType,
    default: AccountType.MEMBER,
    name: 'account_type',
  })
  accountType: AccountType;

  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.PENDING,
    name: 'account_status',
  })
  accountStatus: AccountStatus;

  @Column({ type: 'text', nullable: true, name: 'profile_picture' })
  profilePicture: string;

  @ManyToOne(() => Role, (role) => role.users, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => WorkingUnit, (workingUnit) => workingUnit.members, {
    nullable: true,
  })
  @JoinColumn({ name: 'working_unit_id' })
  workingUnit: WorkingUnit;

  @ManyToMany(() => Project, (project) => project.members)
  projects: Project[];

  @ManyToMany(() => Task, (task) => task.members)
  tasks: Task[];
}
