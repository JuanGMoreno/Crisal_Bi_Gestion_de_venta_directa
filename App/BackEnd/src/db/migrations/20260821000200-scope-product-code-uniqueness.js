const PRODUCT_CODE_UNIQUE_INDEX = 'productos_id_distribuidor_codigo_unique';

function getIndexFields(index) {
  return index.fields.map((field) => field.attribute || field.name);
}

function hasExactFields(fields, expectedFields) {
  const normalizedFields = Array.isArray(fields)
    ? fields
    : String(fields || '')
        .replace(/^\{|\}$/g, '')
        .split(',')
        .map((field) => field.replace(/^"|"$/g, '').trim())
        .filter(Boolean);

  return (
    normalizedFields.length === expectedFields.length &&
    normalizedFields.every((field, index) => field === expectedFields[index])
  );
}

export async function up({ queryInterface, sequelize }) {
  await sequelize.transaction(async (transaction) => {
    const [uniqueConstraints] = await sequelize.query(
      `SELECT constraint_info.constraint_name,
              array_agg(attribute.attname ORDER BY constraint_column.ordinality) AS columns
       FROM (
         SELECT constraint_data.oid,
                constraint_data.conrelid,
                constraint_data.conkey,
                constraint_data.conname AS constraint_name
         FROM pg_constraint AS constraint_data
         INNER JOIN pg_class AS table_data
           ON table_data.oid = constraint_data.conrelid
         INNER JOIN pg_namespace AS schema_data
           ON schema_data.oid = table_data.relnamespace
         WHERE schema_data.nspname = current_schema()
           AND table_data.relname = 'productos'
           AND constraint_data.contype = 'u'
       ) AS constraint_info
       CROSS JOIN LATERAL unnest(constraint_info.conkey)
         WITH ORDINALITY AS constraint_column(attnum, ordinality)
       INNER JOIN pg_attribute AS attribute
         ON attribute.attrelid = constraint_info.conrelid
        AND attribute.attnum = constraint_column.attnum
       GROUP BY constraint_info.constraint_name`,
      { transaction }
    );

    for (const constraint of uniqueConstraints) {
      if (hasExactFields(constraint.columns, ['codigo'])) {
        await queryInterface.removeConstraint('productos', constraint.constraint_name, {
          transaction
        });
      }
    }

    const indexes = await queryInterface.showIndex('productos', { transaction });

    for (const index of indexes) {
      if (
        index.unique &&
        !index.primary &&
        hasExactFields(getIndexFields(index), ['codigo'])
      ) {
        await queryInterface.removeIndex('productos', index.name, { transaction });
      }
    }

    const currentIndexes = await queryInterface.showIndex('productos', { transaction });
    const hasBusinessScopedCodeIndex = currentIndexes.some(
      (index) =>
        index.unique &&
        hasExactFields(getIndexFields(index), ['id_distribuidor', 'codigo'])
    );

    if (!hasBusinessScopedCodeIndex) {
      await queryInterface.addIndex('productos', ['id_distribuidor', 'codigo'], {
        name: PRODUCT_CODE_UNIQUE_INDEX,
        unique: true,
        transaction
      });
    }
  });
}

export async function down() {
  // No se restaura la restricción global porque impediría que negocios distintos
  // utilicen el mismo código de producto y podría fallar si esos datos ya existen.
}
