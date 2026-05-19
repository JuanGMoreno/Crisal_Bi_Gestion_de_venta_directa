import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { Sequelize } from 'sequelize';
import { SequelizeStorage, Umzug } from 'umzug';

import { sequelize } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsPath = path
  .join(__dirname, 'migrations', '*.js')
  .replace(/\\/g, '/');

export const migrator = new Umzug({
  migrations: {
    glob: migrationsPath,
    resolve: ({ name, path: migrationPath, context }) => ({
      name,
      up: async () => {
        const migration = await import(pathToFileURL(migrationPath).href);
        return migration.up(context);
      },
      down: async () => {
        const migration = await import(pathToFileURL(migrationPath).href);
        return migration.down(context);
      }
    })
  },
  context: {
    queryInterface: sequelize.getQueryInterface(),
    Sequelize,
    sequelize
  },
  storage: new SequelizeStorage({
    sequelize,
    tableName: 'SequelizeMeta'
  }),
  logger: console
});
