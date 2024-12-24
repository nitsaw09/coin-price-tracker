import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: ['src/database/entities/*.{js,ts}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
});
