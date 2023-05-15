import { config } from 'dotenv'
import { DataSource } from 'typeorm'

config()

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_MINI_PROJECT_HOST,
  port: parseInt(process.env.DB_MINI_PROJECT_PORT || '', 10),
  username: process.env.DB_MINI_PROJECT_USERNAME,
  password: process.env.DB_MINI_PROJECT_PASSWORD,
  database: process.env.DB_MINI_PROJECT_DATABASE,
  logging: true,
  synchronize: false,
  migrationsTableName: 'migrations',
  migrations: ['libs/database/src/migrations/**/*{.ts,.js}'],
  entities: ['libs/database/src/entities/**/*{.ts,.js}'],
})
