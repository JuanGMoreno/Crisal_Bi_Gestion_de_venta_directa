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
  id_lote_producto: {
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
  subtotal: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: { min: 0 }
  },
  estado: {
    type: DataTypes.ENUM('Activo', 'Inactivo'),
    defaultValue: 'Activo'
  }
}, {
  timestamps: true,
  tableName: 'detalle_ventas',
  freezeTableName: true,
  indexes: [
    { fields: ['id_venta'] },
    { fields: ['id_producto'] },
    { fields: ['id_lote_producto'] }
  ]
});

// subtotal automático
SaleDetail.beforeValidate((d) => {
  if (d.cantidad && d.precio_unitario) {
    d.subtotal = (Number(d.cantidad) * Number(d.precio_unitario)).toFixed(2);
  }
});

export default SaleDetail;