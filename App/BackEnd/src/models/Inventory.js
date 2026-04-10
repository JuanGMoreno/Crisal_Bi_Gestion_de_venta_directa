import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';


const Inventory = sequelize.define('Inventory', {
  id_inventario: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  id_distribuidor: {
    type: DataTypes.UUID,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('Activo', 'Inactivo'),
    allowNull: false,
    defaultValue: 'Activo'
  }
}, {
  timestamps: true,
  tableName: 'inventarios',
  freezeTableName: true,
  indexes: [
    { fields: ['id_distribuidor'] },
    { fields: ['estado'] }
  ]
});

export default Inventory;