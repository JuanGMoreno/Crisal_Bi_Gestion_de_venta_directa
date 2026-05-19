async function tableExists(queryInterface, tableName) {
  const tables = await queryInterface.showAllTables();
  return tables.some((table) => {
    const name = typeof table === 'string' ? table : table.tableName || table.name;
    return name === tableName;
  });
}

async function createTableIfMissing(queryInterface, tableName, definition) {
  if (await tableExists(queryInterface, tableName)) return;
  await queryInterface.createTable(tableName, definition);
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

function timestamps(Sequelize) {
  return {
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false
    }
  };
}

export async function up({ queryInterface, Sequelize }) {
  await createTableIfMissing(queryInterface, 'usuarios', {
    id_usuario: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    correo: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    contrasena: {
      type: Sequelize.STRING,
      allowNull: false
    },
    estado: {
      type: Sequelize.ENUM('Activo', 'Inactivo'),
      defaultValue: 'Activo'
    },
    ...timestamps(Sequelize)
  });

  await createTableIfMissing(queryInterface, 'distribuidores', {
    id_distribuidor: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    id_usuario: {
      type: Sequelize.UUID,
      allowNull: false,
      unique: true,
      references: { model: 'usuarios', key: 'id_usuario' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    id_distribuidor_padre: {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'distribuidores', key: 'id_distribuidor' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    nombre: {
      type: Sequelize.STRING,
      allowNull: false
    },
    rol: {
      type: Sequelize.ENUM('Consultora', 'Lider de Grupo', 'Lider'),
      defaultValue: 'Consultora'
    },
    foto_avatar: {
      type: Sequelize.STRING,
      allowNull: true
    },
    codigo_referido: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    },
    fecha_vencimiento_codigo: {
      type: Sequelize.DATE,
      allowNull: true
    },
    estado: {
      type: Sequelize.ENUM('Activo', 'Inactivo'),
      defaultValue: 'Activo'
    },
    ...timestamps(Sequelize)
  });

  await createTableIfMissing(queryInterface, 'productos', {
    id_producto: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    id_distribuidor: {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: 'distribuidores', key: 'id_distribuidor' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    nombre: {
      type: Sequelize.STRING,
      allowNull: false
    },
    descripcion: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    codigo: {
      type: Sequelize.STRING,
      allowNull: false
    },
    precio_base_venta: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    foto_avatar: {
      type: Sequelize.STRING,
      allowNull: true
    },
    estado: {
      type: Sequelize.ENUM('Activo', 'Inactivo'),
      allowNull: false,
      defaultValue: 'Activo'
    },
    categoria: {
      type: Sequelize.ENUM(
        'Aromaterapia',
        'Bienestar emocional y mental',
        'Bienestar fÃ­sico',
        'Bienestar dermo-comÃ©tico'
      ),
      allowNull: false,
      defaultValue: 'Aromaterapia'
    },
    ...timestamps(Sequelize)
  });

  await createTableIfMissing(queryInterface, 'clientes', {
    id_cliente: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    nombre: {
      type: Sequelize.STRING(120),
      allowNull: false
    },
    direccion: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    cedula: {
      type: Sequelize.STRING(30),
      allowNull: false,
      unique: true
    },
    edad: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    numero_telefono: {
      type: Sequelize.STRING(30),
      allowNull: true
    },
    foto_avatar: {
      type: Sequelize.STRING,
      allowNull: true
    },
    estado: {
      type: Sequelize.ENUM('Activo', 'Inactivo'),
      defaultValue: 'Activo'
    },
    ...timestamps(Sequelize)
  });

  await createTableIfMissing(queryInterface, 'ingresos_inventario', {
    id_ingreso: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    id_distribuidor: {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: 'distribuidores', key: 'id_distribuidor' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    fecha_ingreso: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    observacion: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    estado: {
      type: Sequelize.ENUM('Activo', 'Inactivo'),
      allowNull: false,
      defaultValue: 'Activo'
    },
    ...timestamps(Sequelize)
  });

  await createTableIfMissing(queryInterface, 'detalle_ingreso', {
    id_detalle_ingreso: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    id_producto: {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: 'productos', key: 'id_producto' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    id_ingreso: {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: 'ingresos_inventario', key: 'id_ingreso' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    cantidad_inicial: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    cantidad_disponible: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    costo_unitario_compra: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    fecha_vencimiento: {
      type: Sequelize.DATE,
      allowNull: true
    },
    numero_lote_fabricacion: {
      type: Sequelize.STRING,
      allowNull: true
    },
    estado: {
      type: Sequelize.ENUM('Activo', 'Inactivo'),
      allowNull: false,
      defaultValue: 'Activo'
    },
    ...timestamps(Sequelize)
  });

  await createTableIfMissing(queryInterface, 'ventas', {
    id_venta: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    id_distribuidor: {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: 'distribuidores', key: 'id_distribuidor' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    id_usuario: {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'usuarios', key: 'id_usuario' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    id_cliente: {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'clientes', key: 'id_cliente' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    fecha_venta: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    total: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0
    },
    estado: {
      type: Sequelize.ENUM('Abierta', 'Cerrada', 'Anulada'),
      allowNull: false,
      defaultValue: 'Abierta'
    },
    ...timestamps(Sequelize)
  });

  await createTableIfMissing(queryInterface, 'detalle_ventas', {
    id_detalle_venta: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    id_venta: {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: 'ventas', key: 'id_venta' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    id_producto: {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: 'productos', key: 'id_producto' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    cantidad: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    precio_unitario: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false
    },
    descuento_unitario: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0
    },
    subtotal: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false
    },
    estado: {
      type: Sequelize.ENUM('Activo', 'Inactivo'),
      allowNull: false,
      defaultValue: 'Activo'
    },
    ...timestamps(Sequelize)
  });

  await createTableIfMissing(queryInterface, 'consumos_detalle_venta', {
    id_consumo_detalle_venta: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    id_detalle_venta: {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: 'detalle_ventas', key: 'id_detalle_venta' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    id_detalle_ingreso: {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: 'detalle_ingreso', key: 'id_detalle_ingreso' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    cantidad: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    ...timestamps(Sequelize)
  });

  await addIndexSafe(queryInterface, 'distribuidores', ['id_usuario']);
  await addIndexSafe(queryInterface, 'distribuidores', ['id_distribuidor_padre']);
  await addIndexSafe(queryInterface, 'distribuidores', ['estado']);
  await addIndexSafe(queryInterface, 'productos', ['id_distribuidor']);
  await addIndexSafe(queryInterface, 'productos', ['id_distribuidor', 'codigo'], {
    unique: true
  });
  await addIndexSafe(queryInterface, 'productos', ['nombre']);
  await addIndexSafe(queryInterface, 'productos', ['estado']);
  await addIndexSafe(queryInterface, 'productos', ['categoria']);
  await addIndexSafe(queryInterface, 'clientes', ['cedula'], { unique: true });
  await addIndexSafe(queryInterface, 'clientes', ['nombre']);
  await addIndexSafe(queryInterface, 'clientes', ['estado']);
  await addIndexSafe(queryInterface, 'ingresos_inventario', ['id_distribuidor']);
  await addIndexSafe(queryInterface, 'ingresos_inventario', ['fecha_ingreso']);
  await addIndexSafe(queryInterface, 'ingresos_inventario', ['estado']);
  await addIndexSafe(queryInterface, 'detalle_ingreso', ['id_ingreso']);
  await addIndexSafe(queryInterface, 'detalle_ingreso', ['id_producto']);
  await addIndexSafe(queryInterface, 'detalle_ingreso', ['estado']);
  await addIndexSafe(queryInterface, 'detalle_ingreso', ['fecha_vencimiento']);
  await addIndexSafe(queryInterface, 'detalle_ingreso', ['id_ingreso', 'id_producto']);
  await addIndexSafe(queryInterface, 'ventas', ['id_distribuidor']);
  await addIndexSafe(queryInterface, 'ventas', ['id_usuario']);
  await addIndexSafe(queryInterface, 'ventas', ['id_cliente']);
  await addIndexSafe(queryInterface, 'ventas', ['fecha_venta']);
  await addIndexSafe(queryInterface, 'ventas', ['estado']);
  await addIndexSafe(queryInterface, 'detalle_ventas', ['id_venta']);
  await addIndexSafe(queryInterface, 'detalle_ventas', ['id_producto']);
  await addIndexSafe(queryInterface, 'detalle_ventas', ['estado']);
  await addIndexSafe(queryInterface, 'consumos_detalle_venta', ['id_detalle_venta']);
  await addIndexSafe(queryInterface, 'consumos_detalle_venta', ['id_detalle_ingreso']);
  await addIndexSafe(
    queryInterface,
    'consumos_detalle_venta',
    ['id_detalle_venta', 'id_detalle_ingreso'],
    { unique: true }
  );
}

export async function down({ queryInterface }) {
  await queryInterface.dropTable('consumos_detalle_venta');
  await queryInterface.dropTable('detalle_ventas');
  await queryInterface.dropTable('ventas');
  await queryInterface.dropTable('detalle_ingreso');
  await queryInterface.dropTable('ingresos_inventario');
  await queryInterface.dropTable('clientes');
  await queryInterface.dropTable('productos');
  await queryInterface.dropTable('distribuidores');
  await queryInterface.dropTable('usuarios');
}
