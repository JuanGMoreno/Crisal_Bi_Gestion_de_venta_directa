import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

const SalesDetailsIncome = sequelize.define('SalesDetailsIncome', {
    id_detalle_venta_ingreso: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    id_detalle_venta: {
        type: DataTypes.UUID,
        allowNull: false
    },
    id_detalle_ingreso: {
        type: DataTypes.UUID,
        allowNull: false
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: { min: 1, isInt: true }
    }
}, {
    timestamps: true,
    tableName: 'detalle_venta_ingresos',
    freezeTableName: true,
    indexes: [
        { fields: ['id_detalle_venta'] },
        { fields: ['id_detalle_ingreso'] },
        { unique: true, fields: ['id_detalle_venta', 'id_detalle_ingreso'] }
    ]
});

export default SalesDetailsIncome;