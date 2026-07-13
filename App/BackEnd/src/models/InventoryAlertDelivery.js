import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

const InventoryAlertDelivery = sequelize.define('InventoryAlertDelivery', {
  id_alerta_inventario_envio: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  id_distribuidor: {
    type: DataTypes.UUID,
    allowNull: false
  },
  id_producto: {
    type: DataTypes.UUID,
    allowNull: false
  },
  alert_type: {
    type: DataTypes.ENUM('LOW_STOCK', 'EXPIRING_OR_EXPIRED'),
    allowNull: false
  },
  recipient_email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  sent_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  alert_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'inventory_alert_deliveries',
  freezeTableName: true,
  indexes: [
    { fields: ['id_distribuidor'] },
    { fields: ['id_producto'] },
    { fields: ['alert_type'] },
    { fields: ['alert_date'] },
    {
      unique: true,
      fields: ['id_distribuidor', 'id_producto', 'alert_type', 'alert_date'],
      name: 'inventory_alert_daily_unique'
    }
  ]
});

export default InventoryAlertDelivery;
