import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

const Batch = sequelize.define('Batch', {
  id_lote: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  id_inventario: {
    type: DataTypes.UUID,
    allowNull: false
  },
  fecha_entrada: {
    type: DataTypes.DATE,
    allowNull: false
  },
  fecha_vencimiento: {
    type: DataTypes.DATE,
    allowNull: false
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0, isInt: true }
  },
  estado: {
    type: DataTypes.ENUM('Activo', 'Inactivo'),
    defaultValue: 'Activo'
  }
}, {
  timestamps: true,
  tableName: 'lotes',
  freezeTableName: true,
  indexes: [
    { fields: ['id_inventario'] },
    { fields: ['fecha_vencimiento'] }
  ]
});

export default Batch;