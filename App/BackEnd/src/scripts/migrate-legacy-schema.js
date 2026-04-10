import 'dotenv/config';

import { sequelize } from '../config/database.js';
import '../models/index.js';

function normalizeCountResult(result) {
  if (!result || result.length === 0) return 0;
  const row = result[0];
  const value = row.total ?? row.count ?? Object.values(row)[0] ?? 0;
  return Number(value) || 0;
}

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
  if (newExists) {
    console.warn(`- Se mantiene "${oldName}" porque "${newName}" ya existe (revisa si deseas consolidar datos manualmente).`);
    return;
  }

  await sequelize.query(`ALTER TABLE "${oldName}" RENAME TO "${newName}";`);
  console.log(`- Tabla renombrada: "${oldName}" -> "${newName}"`);
}

async function ensureProductsDistributorIntegrity() {
  const nullRows = await sequelize.query(
    `SELECT COUNT(*) AS total FROM "productos" WHERE id_distribuidor IS NULL;`,
    { type: sequelize.QueryTypes.SELECT }
  );

  const totalNull = normalizeCountResult(nullRows);
  if (totalNull === 0) return;

  const defaultDistributorId = process.env.MIGRATION_DEFAULT_DISTRIBUTOR_ID;

  if (!defaultDistributorId) {
    throw new Error(
      `Hay ${totalNull} productos con id_distribuidor NULL. ` +
      'Define MIGRATION_DEFAULT_DISTRIBUTOR_ID en .env para asignarlos antes de aplicar NOT NULL.'
    );
  }

  const distributorRows = await sequelize.query(
    `
      SELECT id_distribuidor
      FROM "distribuidores"
      WHERE id_distribuidor = :id
      LIMIT 1;
    `,
    {
      replacements: { id: defaultDistributorId },
      type: sequelize.QueryTypes.SELECT
    }
  );

  if (distributorRows.length === 0) {
    throw new Error(
      `MIGRATION_DEFAULT_DISTRIBUTOR_ID (${defaultDistributorId}) no existe en distribuidores.`
    );
  }

  await sequelize.query(
    `
      UPDATE "productos"
      SET id_distribuidor = :id
      WHERE id_distribuidor IS NULL;
    `,
    {
      replacements: { id: defaultDistributorId },
      type: sequelize.QueryTypes.UPDATE
    }
  );

  console.log(`- Productos actualizados con id_distribuidor por defecto: ${totalNull}`);
}

async function dropLegacyTables() {
  await sequelize.query('DROP TABLE IF EXISTS "lote_productos" CASCADE;');
  await sequelize.query('DROP TABLE IF EXISTS "lotes" CASCADE;');
  console.log('- Tablas legacy eliminadas: lote_productos, lotes');
}

async function migrateLegacyNames() {
  // Compatibilidad con nombres de tablas previas del proyecto.
  await renameTableIfNeeded('Ingresos Inventario', 'ingresos_inventario');
  await renameTableIfNeeded('detalles de ingreso', 'detalle_ingreso');
  await renameTableIfNeeded('ventas_ingresos', 'detalle_venta_ingresos');
}

async function main() {
  try {
    await sequelize.authenticate();
    console.log('✓ Conectado a base de datos');

    await migrateLegacyNames();
    await ensureProductsDistributorIntegrity();
    await dropLegacyTables();

    await sequelize.sync({ alter: true });
    console.log('✓ Migracion legacy completada y esquema sincronizado');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error en migracion legacy:', error.message);
    process.exit(1);
  }
}

main();
