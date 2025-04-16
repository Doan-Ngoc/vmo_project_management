import { plainToInstance } from 'class-transformer';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  static plainToClass<T>(this: new (...arg: any[]) => T, obj: T): T {
    return plainToInstance(this, obj);
  }

  static plainToClassArray<T>(this: new (...arg: any[]) => T, obj: T[]): T[] {
    return plainToInstance(this, obj);
  }
}
