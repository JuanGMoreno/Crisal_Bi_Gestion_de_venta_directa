const PRODUCT_CODE_UNIQUE_INDEX = 'productos_id_distribuidor_codigo_unique';

function getIndexFields(index) {
  return index.fields.map((field) => field.attribute || field.name);
}

function isBusinessScopedCodeIndex(index) {
  const fields = getIndexFields(index);
  return (
    index.unique &&
    fields.length === 2 &&
    fields[0] === 'id_distribuidor' &&
    fields[1] === 'codigo'
  );
}

export async function up({ queryInterface, sequelize }) {
  await sequelize.transaction(async (transaction) => {
    const indexes = await queryInterface.showIndex('productos', { transaction });
    const businessScopedIndexes = indexes.filter(isBusinessScopedCodeIndex);
    const hasCanonicalIndex = businessScopedIndexes.some(
      (index) => index.name === PRODUCT_CODE_UNIQUE_INDEX
    );

    if (!hasCanonicalIndex) return;

    for (const index of businessScopedIndexes) {
      if (index.name !== PRODUCT_CODE_UNIQUE_INDEX) {
        await queryInterface.removeIndex('productos', index.name, { transaction });
      }
    }
  });
}

export async function down() {
  // El índice eliminado era redundante; el índice canónico conserva la unicidad.
}
