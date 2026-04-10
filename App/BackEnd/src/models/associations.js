

import User from './User.js';
import Distributor from './Distributor.js';
import Inventory from './Inventory.js';
import InventoryIncome from './inventory_income.js';
import Product from './Product.js';
import EntryDetail from './entry_details.js';
import Client from './Client.js';
import Sale from './Sale.js';
import SaleDetail from './SaleDetail.js';
import SalesDetailsIncome from './SalesDetailsIncome.js';

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
// Distributor <-> Inventory (1:N)
// --------------------
Inventory.belongsTo(Distributor, {
  as: 'distribuidor',
  foreignKey: {
    name: 'id_distribuidor',
    allowNull: false
  },
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
});
Distributor.hasMany(Inventory, {
  as: 'inventarios',
  foreignKey: 'id_distribuidor'
});

// --------------------
// Distributor <-> Product (1:N)
// Distributor <-> Client (1:N)
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

// --------------------
// Inventory <-> InventoryIncome (1:N)
// --------------------
InventoryIncome.belongsTo(Inventory, {
  as: 'inventario',
  foreignKey: {
    name: 'id_inventario',
    allowNull: false
  },
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
});
Inventory.hasMany(InventoryIncome, {
  as: 'ingresos',
  foreignKey: 'id_inventario'
});

// --------------------
// InventoryIncome <-> EntryDetail (1:N)
// Product <-> EntryDetail (1:N)
// --------------------
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
  onDelete: 'CASCADE'
});
Product.hasMany(EntryDetail, {
  as: 'detalles_ingreso',
  foreignKey: 'id_producto'
});

// --------------------
// Client <-> Sale (1:N)
// Distributor <-> Sale (1:N)
// --------------------
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
// EntryDetail <-> SalesDetailsIncome (1:N)
// SaleDetail <-> SalesDetailsIncome (1:N)
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

SalesDetailsIncome.belongsTo(SaleDetail, {
  as: 'detalle_venta',
  foreignKey: {
    name: 'id_detalle_venta',
    allowNull: false
  },
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
});
SaleDetail.hasMany(SalesDetailsIncome, {
  as: 'consumos_ingreso',
  foreignKey: 'id_detalle_venta'
});

SalesDetailsIncome.belongsTo(EntryDetail, {
  as: 'detalle_ingreso',
  foreignKey: {
    name: 'id_detalle_ingreso',
    allowNull: false
  },
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT'
});
EntryDetail.hasMany(SalesDetailsIncome, {
  as: 'salidas_venta',
  foreignKey: 'id_detalle_ingreso'
});

SaleDetail.belongsToMany(EntryDetail, {
  as: 'detalles_ingreso',
  through: SalesDetailsIncome,
  foreignKey: 'id_detalle_venta',
  otherKey: 'id_detalle_ingreso'
});

EntryDetail.belongsToMany(SaleDetail, {
  as: 'detalles_venta',
  through: SalesDetailsIncome,
  foreignKey: 'id_detalle_ingreso',
  otherKey: 'id_detalle_venta'
});

// No exporta nada: basta con importar este archivo para registrar asociaciones.