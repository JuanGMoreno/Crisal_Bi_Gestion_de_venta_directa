import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

const EntryDetail = sequelize.define('EntryDetail', {
  id_detalle_ingreso: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  id_producto: {
    type: DataTypes.UUID,
    allowNull: false
  },
  id_ingreso: {
    type: DataTypes.UUID,
    allowNull: false
  },
  cantidad_inicial: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, isInt: true }
  },
  cantidad_disponible: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0, isInt: true }
  },
  costo_unitario_compra: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 }
  },
  fecha_vencimiento: {
    type: DataTypes.DATE,
    allowNull: true
  },
  numero_lote_fabricacion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('Activo', 'Inactivo'),
    allowNull: false,
    defaultValue: 'Activo'
  }
}, {
  timestamps: true,
  tableName: 'detalle_ingreso',
  freezeTableName: true,
  indexes: [
    { fields: ['id_ingreso'] },
    { fields: ['id_producto'] },
    { fields: ['estado'] },
    { fields: ['fecha_vencimiento'] },
    { fields: ['id_ingreso', 'id_producto'] }
  ]
});

export default EntryDetail;