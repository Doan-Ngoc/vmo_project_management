import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from '../../permissions/entities/permission.entity';
import { User } from '../../users/entities/user.entity';
import { BaseEntity } from '@/databases/base.entity';
import { Exclude } from 'class-transformer';
@Entity('roles')
export class Role extends BaseEntity {
  @Column({
    type: 'varchar',
    unique: true,
  })
  name: string;

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({
    name: 'role_permission',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  @Exclude()
  permissions: Permission[];

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
