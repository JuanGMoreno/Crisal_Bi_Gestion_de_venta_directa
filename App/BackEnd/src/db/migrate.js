import 'dotenv/config';

import { sequelize } from '../config/database.js';
import { migrator } from './migrator.js';

const command = process.argv[2] || 'up';

async function run() {
  try {
    await sequelize.authenticate();

    if (command === 'up') {
      const migrations = await migrator.up();
      console.log(`Migraciones aplicadas: ${migrations.length}`);
      return;
    }

    if (command === 'down') {
      const migrations = await migrator.down();
      console.log(`Migraciones revertidas: ${migrations.length}`);
      return;
    }

    if (command === 'status') {
      const [executed, pending] = await Promise.all([
        migrator.executed(),
        migrator.pending()
      ]);

      console.table([
        ...executed.map((migration) => ({
          migration: migration.name,
          status: 'executed'
        })),
        ...pending.map((migration) => ({
          migration: migration.name,
          status: 'pending'
        }))
      ]);
      return;
    }

    throw new Error(`Comando de migracion no soportado: ${command}`);
  } finally {
    await sequelize.close();
  }
}

run().catch((error) => {
  console.error('Error ejecutando migraciones:', error);
  process.exit(1);
});
