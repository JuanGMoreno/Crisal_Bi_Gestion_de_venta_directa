import 'dotenv/config';

import { sequelize } from '../config/database.js';
import '../models/index.js';

async function tableExists(tableName) {
  const rows = await sequelize.query(
    `
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = :tableName
      LIMIT 1;
    `,
    {
      replacements: { tableName },
      type: sequelize.QueryTypes.SELECT
    }
  );

  return rows.length > 0;
}

async function renameTableIfNeeded(oldName, newName) {
  const oldExists = await tableExists(oldName);
  if (!oldExists) return;

  const newExists = await tableExists(newName);
  if (newExists) return;

  await sequelize.query(`ALTER TABLE "${oldName}" RENAME TO "${newName}";`);
  console.log(`- Tabla renombrada: ${oldName} -> ${newName}`);
}

async function renameColumnIfNeeded(tableName, oldName, newName) {
  const hasOldColumn = await columnExists(tableName, oldName);
  const hasNewColumn = await columnExists(tableName, newName);

  if (!hasOldColumn || hasNewColumn) return;

  await sequelize.query(
    `ALTER TABLE "${tableName}" RENAME COLUMN "${oldName}" TO "${newName}";`
  );
  console.log(`- Columna renombrada en ${tableName}: ${oldName} -> ${newName}`);
}

async function columnExists(tableName, columnName) {
  const rows = await sequelize.query(
    `
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = :tableName
        AND column_name = :columnName
      LIMIT 1;
    `,
    {
      replacements: { tableName, columnName },
      type: sequelize.QueryTypes.SELECT
    }
  );

  return rows.length > 0;
}

async function migrateSaleConsumptionsTable() {
  await renameTableIfNeeded('detalle_venta_ingresos', 'consumos_detalle_venta');
  await renameColumnIfNeeded(
    'consumos_detalle_venta',
    'id_detalle_venta_ingreso',
    'id_consumo_detalle_venta'
  );
}

async function migrateInventoryIncomeToDistributor() {
  const hasInventoryIncomeTable = await tableExists('ingresos_inventario');
  if (!hasInventoryIncomeTable) return;

  const hasInventoryId = await columnExists('ingresos_inventario', 'id_inventario');
  const hasDistributorId = await columnExists('ingresos_inventario', 'id_distribuidor');

  if (hasInventoryId && !hasDistributorId) {
    await sequelize.query(`
      ALTER TABLE "ingresos_inventario"
      ADD COLUMN "id_distribuidor" UUID;
    `);

    await sequelize.query(`
      UPDATE "ingresos_inventario" ii
      SET id_distribuidor = inv.id_distribuidor
      FROM "inventarios" inv
      WHERE ii.id_inventario = inv.id_inventario;
    `);

    await sequelize.query(`
      ALTER TABLE "ingresos_inventario"
      ALTER COLUMN "id_distribuidor" SET NOT NULL;
    `);

    await sequelize.query(`
      ALTER TABLE "ingresos_inventario"
      DROP COLUMN "id_inventario";
    `);

    console.log('- ingresos_inventario migrada de id_inventario a id_distribuidor');
  }
}

async function dropObsoleteTables() {
  const obsoleteTables = [
    'inventarios'
  ];

  for (const tableName of obsoleteTables) {
    if (await tableExists(tableName)) {
      await sequelize.query(`DROP TABLE IF EXISTS "${tableName}" CASCADE;`);
      console.log(`- Tabla eliminada: ${tableName}`);
    }
  }
}

async function main() {
  try {
    await sequelize.authenticate();
    console.log('Conectado a base de datos');

    await migrateSaleConsumptionsTable();
    await migrateInventoryIncomeToDistributor();
    await dropObsoleteTables();

    await sequelize.sync({ alter: true });
    console.log('Simplificacion del dominio completada');
    process.exit(0);
  } catch (error) {
    console.error('Error en simplificacion del dominio:', error.message);
    process.exit(1);
  }
}

main();
