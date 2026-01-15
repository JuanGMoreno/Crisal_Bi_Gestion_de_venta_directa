
import { sequelize } from '../database/database.js';
import { DataTypes } from 'sequelize';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('Consultora', 'Líder de Grupo', 'Líder'),
        defaultValue: 'Consultora'
    }
}, {
    timestamps: true 
});

export default User;