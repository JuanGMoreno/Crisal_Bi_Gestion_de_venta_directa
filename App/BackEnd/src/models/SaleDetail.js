import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

const SaleDetail = sequelize.define('SaleDetail', {
  id_detalle_venta: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  id_venta: {
    type: DataTypes.UUID,
    allowNull: false
  },
  id_producto: {
    type: DataTypes.UUID,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, isInt: true }
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: { min: 0 }
  },
  descuento_unitario: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0 }
  },
  subtotal: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: { min: 0 }
  },
  estado: {
    type: DataTypes.ENUM('Activo', 'Inactivo'),
    allowNull: false,
    defaultValue: 'Activo'
  }
}, {
  timestamps: true,
  tableName: 'detalle_ventas',
  freezeTableName: true,
  indexes: [
    { fields: ['id_venta'] },
    { fields: ['id_producto'] },
    { fields: ['estado'] }
  ]
});

// subtotal automático
SaleDetail.beforeValidate((d) => {
  if (d.cantidad != null && d.precio_unitario != null) {
    const cantidad = Number(d.cantidad || 0);
    const precio = Number(d.precio_unitario || 0);
    const descuento = Number(d.descuento_unitario || 0);
    const precioNeto = Math.max(precio - descuento, 0);
    d.subtotal = (cantidad * precioNeto).toFixed(2);
  }
});

export default SaleDetail;