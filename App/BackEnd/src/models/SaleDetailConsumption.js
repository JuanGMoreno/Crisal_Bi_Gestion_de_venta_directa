import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

const SaleDetailConsumption = sequelize.define('SaleDetailConsumption', {
  id_consumo_detalle_venta: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  id_detalle_venta: {
    type: DataTypes.UUID,
    allowNull: false
  },
  id_detalle_ingreso: {
    type: DataTypes.UUID,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, isInt: true }
  }
}, {
  timestamps: true,
  tableName: 'consumos_detalle_venta',
  freezeTableName: true,
  indexes: [
    { fields: ['id_detalle_venta'] },
    { fields: ['id_detalle_ingreso'] },
    { unique: true, fields: ['id_detalle_venta', 'id_detalle_ingreso'] }
  ]
});

export default SaleDetailConsumption;
