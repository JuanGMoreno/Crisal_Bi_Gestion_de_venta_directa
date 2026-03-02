import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

const ProductBatch = sequelize.define('ProductBatch', {
  id_lote_producto: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  id_producto: {
    type: DataTypes.UUID,
    allowNull: false
  },
  id_lote: {
    type: DataTypes.UUID,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0, isInt: true } 
  },
  fecha_ingreso: {
    type: DataTypes.DATE, 
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  estado: {
    type: DataTypes.ENUM('Activo', 'Inactivo'),
    defaultValue: 'Activo'
  }
}, {
  timestamps: true,
  tableName: 'lotes_productos',
  freezeTableName: true,
  indexes: [
    { fields: ['id_lote'] },
    { fields: ['id_producto'] },
    { unique: true, fields: ['id_lote', 'id_producto'] }
  ]
});

export default ProductBatch;