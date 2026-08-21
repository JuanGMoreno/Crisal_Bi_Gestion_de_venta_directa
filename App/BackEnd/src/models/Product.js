import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

const Product = sequelize.define('Product', {
    id_producto: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    id_distribuidor: {
        type: DataTypes.UUID,
        allowNull: false
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
        type: DataTypes.TEXT,
        allowNull: true,
    },
    codigo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true, len: [1, 4] }
    },
    precio_base_venta: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 }
    },
    foto_avatar: {
        type: DataTypes.STRING,
        allowNull: true
    },
    estado: {
        type: DataTypes.ENUM('Activo', 'Inactivo'),
        allowNull: false,
        defaultValue: 'Activo'
    },
    categoria: {
        type: DataTypes.STRING(80),
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: 'productos',
    freezeTableName: true,
    indexes: [
        { fields: ['id_distribuidor'] },
        {
            name: 'productos_id_distribuidor_codigo_unique',
            unique: true,
            fields: ['id_distribuidor', 'codigo']
        },
        { fields: ['nombre'] },
        { fields: ['estado'] },
        { fields: ['categoria'] },
    ]
});

export default Product;
