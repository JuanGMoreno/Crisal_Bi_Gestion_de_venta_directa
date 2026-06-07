async function tableExists(queryInterface, tableName) {
  const tables = await queryInterface.showAllTables();
  return tables.some((table) => {
    const name = typeof table === 'string' ? table : table.tableName || table.name;
    return name === tableName;
  });
}

async function columnExists(queryInterface, tableName, columnName) {
  const table = await queryInterface.describeTable(tableName);
  return Boolean(table[columnName]);
}

async function constraintExists(sequelize, constraintName) {
  const rows = await sequelize.query(
    `
      SELECT 1
      FROM information_schema.table_constraints
      WHERE table_schema = 'public'
        AND constraint_name = :constraintName
      LIMIT 1;
    `,
    {
      replacements: { constraintName },
      type: sequelize.QueryTypes.SELECT
    }
  );

  return rows.length > 0;
}

async function countRows(sequelize, tableName) {
  const rows = await sequelize.query(
    `SELECT COUNT(*)::int AS total FROM "${tableName}";`,
    { type: sequelize.QueryTypes.SELECT }
  );

  return Number(rows[0]?.total || 0);
}

async function addIndexSafe(queryInterface, tableName, fields, options = {}) {
  const indexes = await queryInterface.showIndex(tableName);
  const indexName =
    options.name || `${tableName}_${fields.join('_')}${options.unique ? '_unique' : ''}`;

  if (indexes.some((index) => index.name === indexName)) return;

  await queryInterface.addIndex(tableName, fields, {
    ...options,
    name: indexName
  });
}

async function removeIndexSafe(queryInterface, tableName, indexName) {
  const indexes = await queryInterface.showIndex(tableName);

  if (!indexes.some((index) => index.name === indexName)) return;

  await queryInterface.removeIndex(tableName, indexName);
}

async function removeUniqueCedulaIndexes(queryInterface, sequelize) {
  const indexes = await queryInterface.showIndex('clientes');

  for (const index of indexes) {
    const fields = index.fields?.map((field) => field.attribute || field.name) || [];

    if (index.unique && fields.length === 1 && fields[0] === 'cedula') {
      if (await constraintExists(sequelize, index.name)) {
        await queryInterface.removeConstraint('clientes', index.name);
      } else {
        await queryInterface.removeIndex('clientes', index.name);
      }
    }
  }
}

export async function up({ queryInterface, Sequelize, sequelize }) {
  if (!(await tableExists(queryInterface, 'clientes'))) return;

  const hasDistributorColumn = await columnExists(queryInterface, 'clientes', 'id_distribuidor');

  if (!hasDistributorColumn) {
    await queryInterface.addColumn('clientes', 'id_distribuidor', {
      type: Sequelize.UUID,
      allowNull: true
    });
  }

  const clientsCount = await countRows(sequelize, 'clientes');

  if (clientsCount > 0) {
    const defaultDistributorId = process.env.MIGRATION_DEFAULT_DISTRIBUTOR_ID;

    if (!defaultDistributorId) {
      throw new Error(
        `Hay ${clientsCount} clientes existentes. ` +
        'Define MIGRATION_DEFAULT_DISTRIBUTOR_ID para asignarlos antes de aplicar NOT NULL.'
      );
    }

    await sequelize.query(
      `
        UPDATE "clientes"
        SET id_distribuidor = :defaultDistributorId
        WHERE id_distribuidor IS NULL;
      `,
      {
        replacements: { defaultDistributorId },
        type: sequelize.QueryTypes.UPDATE
      }
    );
  }

  await queryInterface.changeColumn('clientes', 'id_distribuidor', {
    type: Sequelize.UUID,
    allowNull: false
  });

  if (!(await constraintExists(sequelize, 'clientes_id_distribuidor_fkey'))) {
    await queryInterface.addConstraint('clientes', {
      fields: ['id_distribuidor'],
      type: 'foreign key',
      name: 'clientes_id_distribuidor_fkey',
      references: {
        table: 'distribuidores',
        field: 'id_distribuidor'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }

  await removeUniqueCedulaIndexes(queryInterface, sequelize);
  await addIndexSafe(queryInterface, 'clientes', ['id_distribuidor']);
  await addIndexSafe(queryInterface, 'clientes', ['id_distribuidor', 'cedula'], {
    unique: true
  });

  if (await tableExists(queryInterface, 'ventas')) {
    await queryInterface.changeColumn('ventas', 'id_cliente', {
      type: Sequelize.UUID,
      allowNull: true
    });
  }
}

export async function down({ queryInterface, Sequelize }) {
  if (!(await tableExists(queryInterface, 'clientes'))) return;

  await removeIndexSafe(queryInterface, 'clientes', 'clientes_id_distribuidor_cedula_unique');
  await removeIndexSafe(queryInterface, 'clientes', 'clientes_id_distribuidor');

  if (await constraintExists(queryInterface.sequelize, 'clientes_id_distribuidor_fkey')) {
    await queryInterface.removeConstraint('clientes', 'clientes_id_distribuidor_fkey');
  }

  if (await columnExists(queryInterface, 'clientes', 'id_distribuidor')) {
    await queryInterface.removeColumn('clientes', 'id_distribuidor');
  }

  await addIndexSafe(queryInterface, 'clientes', ['cedula'], { unique: true });

  if (await tableExists(queryInterface, 'ventas')) {
    await queryInterface.changeColumn('ventas', 'id_cliente', {
      type: Sequelize.UUID,
      allowNull: true
    });
  }
}
