

import User from './User.js';
import Distributor from './Distributor.js';
import Inventory from './Inventory.js';
import Batch from './Batch.js';
import Product from './Product.js';
import ProductBatch from './ProductBatch.js';
import Client from './Client.js';
import Sale from './Sale.js';
import SaleDetail from './SaleDetail.js';

// --------------------
// User <-> Distributor (1:1)
// --------------------
Distributor.belongsTo(User, {
  foreignKey: 'id_usuario',
  onDelete: 'CASCADE'
});
User.hasOne(Distributor, {
  foreignKey: 'id_usuario'
});

// --------------------
// Distributor jerárquico (padre/hijos)
// --------------------
Distributor.belongsTo(Distributor, {
  as: 'padre',
  foreignKey: 'id_distribuidor_padre',
  onDelete: 'SET NULL',
  constraints: true
});
Distributor.hasMany(Distributor, {
  as: 'hijos',
  foreignKey: 'id_distribuidor_padre',
  constraints: true
});

// --------------------
// Distributor <-> Inventory (1:1)
// --------------------
Inventory.belongsTo(Distributor, {
  foreignKey: 'id_distribuidor',
  onDelete: 'CASCADE'
});
Distributor.hasOne(Inventory, {
  foreignKey: 'id_distribuidor'
});

// --------------------
// Distributor <-> Product (1:N)
// Distributor <-> Client (1:N)
// --------------------
Product.belongsTo(Distributor, {
  foreignKey: 'id_distribuidor',
  onDelete: 'CASCADE'
});
Distributor.hasMany(Product, {
  foreignKey: 'id_distribuidor'
});

Client.belongsTo(Distributor, {
  foreignKey: 'id_distribuidor',
  onDelete: 'CASCADE'
});
Distributor.hasMany(Client, {
  foreignKey: 'id_distribuidor'
});

// --------------------
// Inventory <-> Batch (1:N)
// --------------------
Batch.belongsTo(Inventory, {
  foreignKey: 'id_inventario',
  onDelete: 'CASCADE'
});
Inventory.hasMany(Batch, {
  foreignKey: 'id_inventario'
});

// --------------------
// Batch <-> ProductBatch (1:N)
// Product <-> ProductBatch (1:N)
// --------------------
ProductBatch.belongsTo(Batch, {
  foreignKey: 'id_lote',
  onDelete: 'CASCADE'
});
Batch.hasMany(ProductBatch, {
  foreignKey: 'id_lote'
});

ProductBatch.belongsTo(Product, {
  foreignKey: 'id_producto',
  onDelete: 'CASCADE'
});
Product.hasMany(ProductBatch, {
  foreignKey: 'id_producto'
});

// (Opcional) Si más adelante quieres consultar directo:
// Product.belongsToMany(Batch, { through: ProductBatch, foreignKey: 'id_producto', otherKey: 'id_lote' });
// Batch.belongsToMany(Product, { through: ProductBatch, foreignKey: 'id_lote', otherKey: 'id_producto' });

// --------------------
// Client <-> Sale (1:N)
// Distributor <-> Sale (1:N)
// --------------------
Sale.belongsTo(Client, {
  foreignKey: 'id_cliente',
  onDelete: 'CASCADE'
});
Client.hasMany(Sale, {
  foreignKey: 'id_cliente'
});

Sale.belongsTo(Distributor, {
  foreignKey: 'id_distribuidor',
  onDelete: 'CASCADE'
});
Distributor.hasMany(Sale, {
  foreignKey: 'id_distribuidor'
});

// --------------------
// Sale <-> SaleDetail (1:N)
// Product <-> SaleDetail (1:N)
// ProductBatch <-> SaleDetail (1:N)  (por lote_producto)
// --------------------
SaleDetail.belongsTo(Sale, {
  foreignKey: 'id_venta',
  onDelete: 'CASCADE'
});
Sale.hasMany(SaleDetail, {
  foreignKey: 'id_venta'
});

SaleDetail.belongsTo(Product, {
  foreignKey: 'id_producto',
  onDelete: 'RESTRICT' // recomendado para historial: evita borrar producto si ya se vendió
});
Product.hasMany(SaleDetail, {
  foreignKey: 'id_producto'
});

// IMPORTANTE: en SaleDetail debes tener el campo id_lote_producto (UUID, NOT NULL)
SaleDetail.belongsTo(ProductBatch, {
  foreignKey: 'id_lote_producto',
  onDelete: 'RESTRICT' // evita borrar lote_producto si ya se vendió
});
ProductBatch.hasMany(SaleDetail, {
  foreignKey: 'id_lote_producto'
});

// No exporta nada: basta con importar este archivo para registrar asociaciones.