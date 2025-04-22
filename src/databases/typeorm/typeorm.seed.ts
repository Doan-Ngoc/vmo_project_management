import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { registerAs } from '@nestjs/config';
import { Permission } from '../../modules/permissions/entities/permission.entity';
import { Role } from '../../modules/roles/entities/role.entity';
import { User } from '../../modules/users/entities/user.entity';
import { WorkingUnit } from '../../modules/working-units/entities/working-unit.entity';
import { Project } from '../../modules/projects/entities/project.entity';
import { Task } from '../../modules/tasks/entities/task.entity';
import { TaskComment } from '../../modules/task_comments/entities/task-comment.entity';
import { Client } from '../../modules/clients/entities/client.entity';

dotenv.config({
  path: path.join(
    __dirname,
    `../../../src/configs/.env-${process.env.NODE_ENV || 'dev'}`,
  ),
});

const config = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  database: process.env.POSTGRES_DATABASE,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  // Include all related entities
  entities: [path.join(__dirname, '../../**/*.entity{.ts,.js}')],
  migrations: [],
  migrationsTableName: 'migrations',
  logger: 'advanced-console',
  logging: ['error', 'warn'],
  synchronize: false,
  cache: false,
  connectTimeoutMS: 10000,
  extra: {
    max: 5,
  },
};

export default registerAs('typeorm.seed', () => config);
export const SeedDataSource = new DataSource(config as DataSourceOptions);
