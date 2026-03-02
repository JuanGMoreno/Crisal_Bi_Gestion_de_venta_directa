import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';
import Distributor from './Distributor.js';

const Inventory = sequelize.define('Inventory', {
  id_inventario: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  id_distribuidor: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true
  },
  estado: {
    type: DataTypes.ENUM('Activo', 'Inactivo'),
    defaultValue: 'Activo'
  }
}, {
  timestamps: true,
  tableName: 'inventarios',
  freezeTableName: true
});

export default Inventory;