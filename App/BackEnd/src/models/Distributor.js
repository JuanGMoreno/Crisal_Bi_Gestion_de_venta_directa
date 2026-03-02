import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';
import User from './User.js';

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
  id_distribuidor_padre: {
    type: DataTypes.UUID,
    allowNull: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  rol: {
    type: DataTypes.ENUM('Consultora', 'Lider de Grupo', 'Lider'),
    defaultValue: 'Consultora'
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
    { fields: ['id_distribuidor_padre'] },
    { fields: ['estado'] }
  ]
});

export default Distributor;