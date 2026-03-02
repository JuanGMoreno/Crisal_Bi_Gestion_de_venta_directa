import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';
import ProductBatch from './ProductBatch.js';

const Product = sequelize.define('Product', {
    id_producto: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { 
            notEmpty: true,
            len: [1, 100]
         }
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    codigo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { notEmpty: true }
    },
    precio_compra: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: { min: 0 }
    },
    precio_venta: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: { min: 0 }
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
    tableName: 'productos',
    freezeTableName: true,
    indexes: [
    { fields: ['codigo'] },
    { fields: ['nombre'] },
    { fields: ['estado'] }
  ]
});

export default Product;