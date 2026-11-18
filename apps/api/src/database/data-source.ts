import 'dotenv/config';
import { DataSource } from 'typeorm';
import { databaseConfig } from '../config/database.config';
import { buildTypeOrmOptions } from './typeorm.options';

/** Used by the TypeORM CLI (migrations). Not imported by the Nest app. */
export default new DataSource({
  ...buildTypeOrmOptions(databaseConfig()),
  migrationsRun: false,
});
