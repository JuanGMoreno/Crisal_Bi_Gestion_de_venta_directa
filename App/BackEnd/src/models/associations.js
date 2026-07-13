

import User from './User.js';
import Distributor from './Distributor.js';
import Product from './Product.js';
import InventoryIncome from './inventory_income.js';
import EntryDetail from './entry_details.js';
import Client from './Client.js';
import Sale from './Sale.js';
import SaleDetail from './SaleDetail.js';
import SaleDetailConsumption from './SaleDetailConsumption.js';
import InventoryAlertDelivery from './InventoryAlertDelivery.js';

// --------------------
// User <-> Distributor (1:1)
// --------------------
Distributor.belongsTo(User, {
  as: 'usuario',
  foreignKey: {
    name: 'id_usuario',
    allowNull: false
  },
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
});
User.hasOne(Distributor, {
  as: 'distribuidor',
  foreignKey: 'id_usuario'
});

// --------------------
// Distributor jerárquico (padre/hijos)
// --------------------
Distributor.belongsTo(Distributor, {
  as: 'padre',
  foreignKey: {
    name: 'id_distribuidor_padre',
    allowNull: true
  },
  onUpdate: 'CASCADE',
  onDelete: 'SET NULL',
  constraints: true
});
Distributor.hasMany(Distributor, {
  as: 'hijos',
  foreignKey: 'id_distribuidor_padre',
  constraints: true
});

// --------------------
// Distributor <-> Product (1:N)
// --------------------
Product.belongsTo(Distributor, {
  as: 'distribuidor',
  foreignKey: {
    name: 'id_distribuidor',
    allowNull: false
  },
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
});
Distributor.hasMany(Product, {
  as: 'productos',
  foreignKey: 'id_distribuidor'
});

// --------------------
// Distributor <-> InventoryIncome (1:N)
// InventoryIncome <-> EntryDetail (1:N)
// Product <-> EntryDetail (1:N)
// --------------------
InventoryIncome.belongsTo(Distributor, {
  as: 'distribuidor',
  foreignKey: {
    name: 'id_distribuidor',
    allowNull: false
  },
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
});
Distributor.hasMany(InventoryIncome, {
  as: 'ingresos_inventario',
  foreignKey: 'id_distribuidor'
});

EntryDetail.belongsTo(InventoryIncome, {
  as: 'ingreso',
  foreignKey: {
    name: 'id_ingreso',
    allowNull: false
  },
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
});
InventoryIncome.hasMany(EntryDetail, {
  as: 'detalles',
  foreignKey: 'id_ingreso'
});

EntryDetail.belongsTo(Product, {
  as: 'producto',
  foreignKey: {
    name: 'id_producto',
    allowNull: false
  },
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT'
});
Product.hasMany(EntryDetail, {
  as: 'detalles_ingreso',
  foreignKey: 'id_producto'
});

// --------------------
// Distributor <-> Client (1:N)
// Client <-> Sale (1:N)
// Distributor <-> Sale (1:N)
// --------------------
Client.belongsTo(Distributor, {
  as: 'distribuidor',
  foreignKey: {
    name: 'id_distribuidor',
    allowNull: false
  },
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
});
Distributor.hasMany(Client, {
  as: 'clientes',
  foreignKey: 'id_distribuidor'
});

Sale.belongsTo(Client, {
  as: 'cliente',
  foreignKey: {
    name: 'id_cliente',
    allowNull: true
  },
  onUpdate: 'CASCADE',
  onDelete: 'SET NULL'
});
Client.hasMany(Sale, {
  as: 'ventas',
  foreignKey: 'id_cliente'
});

Sale.belongsTo(Distributor, {
  as: 'distribuidor',
  foreignKey: {
    name: 'id_distribuidor',
    allowNull: false
  },
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
});
Distributor.hasMany(Sale, {
  as: 'ventas',
  foreignKey: 'id_distribuidor'
});

Sale.belongsTo(User, {
  as: 'usuario',
  foreignKey: {
    name: 'id_usuario',
    allowNull: true
  },
  onUpdate: 'CASCADE',
  onDelete: 'SET NULL'
});
User.hasMany(Sale, {
  as: 'ventas',
  foreignKey: 'id_usuario'
});

// --------------------
// Sale <-> SaleDetail (1:N)
// Product <-> SaleDetail (1:N)
// --------------------
SaleDetail.belongsTo(Sale, {
  as: 'venta',
  foreignKey: {
    name: 'id_venta',
    allowNull: false
  },
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
});
Sale.hasMany(SaleDetail, {
  as: 'detalles',
  foreignKey: 'id_venta'
});

SaleDetail.belongsTo(Product, {
  as: 'producto',
  foreignKey: {
    name: 'id_producto',
    allowNull: false
  },
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT' // recomendado para historial: evita borrar producto si ya se vendió
});
Product.hasMany(SaleDetail, {
  as: 'detalles_venta',
  foreignKey: 'id_producto'
});

SaleDetailConsumption.belongsTo(SaleDetail, {
  as: 'detalle_venta',
  foreignKey: {
    name: 'id_detalle_venta',
    allowNull: false
  },
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
});
SaleDetail.hasMany(SaleDetailConsumption, {
  as: 'consumos_stock',
  foreignKey: 'id_detalle_venta'
});

SaleDetailConsumption.belongsTo(EntryDetail, {
  as: 'detalle_ingreso',
  foreignKey: {
    name: 'id_detalle_ingreso',
    allowNull: false
  },
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT'
});
EntryDetail.hasMany(SaleDetailConsumption, {
  as: 'consumos_venta',
  foreignKey: 'id_detalle_ingreso'
});

// --------------------
// Distributor/Product <-> InventoryAlertDelivery (1:N)
// --------------------
InventoryAlertDelivery.belongsTo(Distributor, {
  as: 'distribuidor',
  foreignKey: {
    name: 'id_distribuidor',
    allowNull: false
  },
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
});
Distributor.hasMany(InventoryAlertDelivery, {
  as: 'envios_alertas_inventario',
  foreignKey: 'id_distribuidor'
});

InventoryAlertDelivery.belongsTo(Product, {
  as: 'producto',
  foreignKey: {
    name: 'id_producto',
    allowNull: false
  },
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
});
Product.hasMany(InventoryAlertDelivery, {
  as: 'envios_alertas_inventario',
  foreignKey: 'id_producto'
});

// No exporta nada: basta con importar este archivo para registrar asociaciones.
