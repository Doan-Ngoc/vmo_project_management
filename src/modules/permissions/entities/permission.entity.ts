import { Entity, Column, ManyToMany } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { BaseEntity } from '../../../databases/base.entity';

@Entity('permissions')
export class Permission extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  path: string;

  @Column({ type: 'varchar', length: 50 })
  method: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
