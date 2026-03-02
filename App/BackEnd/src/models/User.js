
import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

const User = sequelize.define('User', {
    id_usuario: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { 
            isEmail: true,
            len: [5, 120]
         }
    },
    contrasena: {
        type: DataTypes.STRING,
        allowNull: false
    } 
}, {
    timestamps: true, 
    tableName: 'usuarios',
    freezeTableName: true
});

export default User;