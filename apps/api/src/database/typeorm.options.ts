import { join } from 'node:path';
import type { DataSourceOptions } from 'typeorm';
import type { DatabaseConfig } from '../config/database.config';

/**
 * Single source of truth for TypeORM options, shared by the Nest
 * runtime (DatabaseModule) and the TypeORM CLI (data-source.ts).
 */
export const buildTypeOrmOptions = (db: DatabaseConfig): DataSourceOptions => ({
  type: 'postgres',
  host: db.host,
  port: db.port,
  username: db.username,
  password: db.password,
  database: db.name,
  ssl: db.ssl ? { rejectUnauthorized: false } : false,
  logging: db.logging,
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  migrationsTableName: 'migrations',
  migrationsRun: db.runMigrations,
  synchronize: false,
});
