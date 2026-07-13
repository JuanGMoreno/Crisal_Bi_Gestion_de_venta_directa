async function tableExists(queryInterface, tableName) {
  const tables = await queryInterface.showAllTables();
  return tables.some((table) => {
    const name = typeof table === 'string' ? table : table.tableName || table.name;
    return name === tableName;
  });
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

export async function up({ queryInterface, Sequelize }) {
  if (!(await tableExists(queryInterface, 'inventory_alert_deliveries'))) {
    await queryInterface.createTable('inventory_alert_deliveries', {
      id_alerta_inventario_envio: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      id_distribuidor: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'distribuidores',
          key: 'id_distribuidor'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_producto: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'productos',
          key: 'id_producto'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      alert_type: {
        type: Sequelize.ENUM('LOW_STOCK', 'EXPIRING_OR_EXPIRED'),
        allowNull: false
      },
      recipient_email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      sent_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      alert_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  }

  await addIndexSafe(queryInterface, 'inventory_alert_deliveries', ['id_distribuidor']);
  await addIndexSafe(queryInterface, 'inventory_alert_deliveries', ['id_producto']);
  await addIndexSafe(queryInterface, 'inventory_alert_deliveries', ['alert_type']);
  await addIndexSafe(queryInterface, 'inventory_alert_deliveries', ['alert_date']);
  await addIndexSafe(
    queryInterface,
    'inventory_alert_deliveries',
    ['id_distribuidor', 'id_producto', 'alert_type', 'alert_date'],
    {
      unique: true,
      name: 'inventory_alert_daily_unique'
    }
  );
}

export async function down({ queryInterface }) {
  if (await tableExists(queryInterface, 'inventory_alert_deliveries')) {
    await queryInterface.dropTable('inventory_alert_deliveries');
  }

  await queryInterface.sequelize.query(
    'DROP TYPE IF EXISTS "enum_inventory_alert_deliveries_alert_type";'
  );
}
