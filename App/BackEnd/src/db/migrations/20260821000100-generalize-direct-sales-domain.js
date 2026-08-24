const LEGACY_PRODUCT_CATEGORIES = [
  'Aromaterapia',
  'Bienestar emocional y mental',
  'Bienestar físico',
  'Bienestar dermo-comético'
];

export async function up({ queryInterface, sequelize }) {
  const distributorDefinition = await queryInterface.describeTable('distribuidores');

  await sequelize.transaction(async (transaction) => {
    await sequelize.query(
      `ALTER TABLE "productos"
       ALTER COLUMN "categoria" DROP DEFAULT,
       ALTER COLUMN "categoria" DROP NOT NULL,
       ALTER COLUMN "categoria" TYPE VARCHAR(80) USING "categoria"::text`,
      { transaction }
    );

    for (const columnName of [
      'id_distribuidor_padre',
      'rol',
      'codigo_referido',
      'fecha_vencimiento_codigo'
    ]) {
      if (distributorDefinition[columnName]) {
        await queryInterface.removeColumn('distribuidores', columnName, { transaction });
      }
    }

    await sequelize.query('DROP TYPE IF EXISTS "enum_productos_categoria"', { transaction });
    await sequelize.query('DROP TYPE IF EXISTS "enum_distribuidores_rol"', { transaction });
  });
}

export async function down({ queryInterface, Sequelize, sequelize }) {
  await sequelize.transaction(async (transaction) => {
    await queryInterface.addColumn('distribuidores', 'id_distribuidor_padre', {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'distribuidores', key: 'id_distribuidor' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    }, { transaction });
    await queryInterface.addColumn('distribuidores', 'rol', {
      type: Sequelize.ENUM('Consultora', 'Lider de Grupo', 'Lider'),
      allowNull: false,
      defaultValue: 'Consultora'
    }, { transaction });
    await queryInterface.addColumn('distribuidores', 'codigo_referido', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    }, { transaction });
    await queryInterface.addColumn('distribuidores', 'fecha_vencimiento_codigo', {
      type: Sequelize.DATE,
      allowNull: true
    }, { transaction });
    await queryInterface.addIndex('distribuidores', ['id_distribuidor_padre'], {
      name: 'distribuidores_id_distribuidor_padre',
      transaction
    });

    const legacyValues = LEGACY_PRODUCT_CATEGORIES
      .map((value) => sequelize.escape(value))
      .join(', ');
    await sequelize.query(
      `CREATE TYPE "enum_productos_categoria" AS ENUM (${legacyValues})`,
      { transaction }
    );
    await sequelize.query(
      `ALTER TABLE "productos"
       ALTER COLUMN "categoria" TYPE "enum_productos_categoria"
       USING CASE
         WHEN "categoria" IN (${legacyValues})
           THEN "categoria"::"enum_productos_categoria"
         ELSE 'Aromaterapia'::"enum_productos_categoria"
       END,
       ALTER COLUMN "categoria" SET DEFAULT 'Aromaterapia',
       ALTER COLUMN "categoria" SET NOT NULL`,
      { transaction }
    );
  });
}
