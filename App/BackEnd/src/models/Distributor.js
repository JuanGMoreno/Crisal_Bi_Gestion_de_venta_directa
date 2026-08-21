import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';


const Distributor = sequelize.define('Distributor', {
  id_distribuidor: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  id_usuario: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  foto_avatar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('Activo', 'Inactivo'),
    defaultValue: 'Activo'
  }
}, {
  timestamps: true,
  tableName: 'distribuidores',
  freezeTableName: true,
  indexes: [
    { fields: ['id_usuario'] },
    { fields: ['estado'] }
  ]
});

export default Distributor;
