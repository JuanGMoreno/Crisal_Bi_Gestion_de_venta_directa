import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

const Sale = sequelize.define('Sale', {
  id_venta: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  id_distribuidor: {
    type: DataTypes.UUID,
    allowNull: false
  },
  id_usuario: {
    type: DataTypes.UUID,
    allowNull: true
  },
  id_cliente: {
    type: DataTypes.UUID,
    allowNull: true
  },
  fecha_venta: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  total: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0 }
  },
  estado: {
    type: DataTypes.ENUM('Abierta', 'Cerrada', 'Anulada'),
    allowNull: false,
    defaultValue: 'Abierta'
  }
}, {
  timestamps: true,
  tableName: 'ventas',
  freezeTableName: true,
  indexes: [
    { fields: ['id_distribuidor'] },
    { fields: ['id_usuario'] },
    { fields: ['id_cliente'] },
    { fields: ['fecha_venta'] },
    { fields: ['estado'] }
  ]
});

export default Sale;