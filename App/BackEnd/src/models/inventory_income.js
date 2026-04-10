import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

const InventoryIncome = sequelize.define('InventoryIncome', {
  id_ingreso: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  id_inventario: {
    type: DataTypes.UUID,
    allowNull: false
  },
  fecha_ingreso: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  observacion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('Activo', 'Inactivo'),
    allowNull: false,
    defaultValue: 'Activo'
  }
}, {
  timestamps: true,
  tableName: 'ingresos_inventario',
  freezeTableName: true,
  indexes: [
    { fields: ['id_inventario'] },
    { fields: ['fecha_ingreso'] },
    { fields: ['estado'] }
  ]
});

export default InventoryIncome;