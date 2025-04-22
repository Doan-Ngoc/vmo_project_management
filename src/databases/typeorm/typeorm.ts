import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { registerAs } from '@nestjs/config';

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
  entities: [path.join(__dirname, '../../**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, '/migrations/**/*{.ts,.js}')],
  migrationsTableName: 'migrations',
  // logger: 'advanced-console',
  // logging: ['query', 'error', 'schema', 'warn', 'info', 'log', 'migration'],
};

export default registerAs('typeorm', () => config);
export const AppDataSource = new DataSource(config as DataSourceOptions);
