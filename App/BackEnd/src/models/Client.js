import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

const Client = sequelize.define('Client', {
  id_cliente: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(120),
    allowNull: false,
    validate: { notEmpty: true, len: [2, 120] }
  },
  direccion: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  cedula: {
    type: DataTypes.STRING(30),
    allowNull: false,          
    unique: true,
    validate: { notEmpty: true, len: [4, 30] }
  },
  edad: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: { min: 0, max: 120, isInt: true }
  },
  numero_telefono: {
    type: DataTypes.STRING(30),
    allowNull: true
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
  tableName: 'clientes',
  freezeTableName: true,
  indexes: [
    { fields: ['cedula'] },
    { fields: ['nombre'] },
    { fields: ['estado'] }
  ]
});

export default Client;