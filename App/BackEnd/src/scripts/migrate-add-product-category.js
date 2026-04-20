import 'dotenv/config';
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const CATEGORIES = [
  'Aromaterapia',
  'Bienestar emocional y mental',
  'Bienestar físico',
  'Bienestar dermo-comético'
];

async function migrateAddProductCategory() {
  const queryInterface = sequelize.getQueryInterface();

  try {
    await sequelize.authenticate();

    const tableDefinition = await queryInterface.describeTable('productos');
    const hasCategoryColumn = Boolean(tableDefinition.categoria);

    if (!hasCategoryColumn) {
      await queryInterface.addColumn('productos', 'categoria', {
        type: DataTypes.ENUM(...CATEGORIES),
        allowNull: false,
        defaultValue: 'Aromaterapia'
      });
      console.log('✓ Columna categoria agregada en productos');
    } else {
      console.log('✓ La columna categoria ya existe en productos');
    }

    const [indexes] = await sequelize.query(`
      SELECT indexname
      FROM pg_indexes
      WHERE schemaname = current_schema()
        AND tablename = 'productos'
        AND indexname = 'productos_categoria'
    `);

    if (!indexes.length) {
      await queryInterface.addIndex('productos', ['categoria'], {
        name: 'productos_categoria'
      });
      console.log('✓ Índice productos_categoria creado');
    } else {
      console.log('✓ El índice productos_categoria ya existe');
    }

    console.log('✓ Migración completada: categoria en productos');
  } catch (error) {
    console.error('✗ Error en migración de categoria:', error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

migrateAddProductCategory();