import { User } from '../models/index.js';

export const UserRepository = {
    /**
     * Buscar todos los usuarios
     */
    findAll: async () => {
        return await User.findAll({
            order: [['createdAt', 'DESC']]
        });
    },
    /**
    * Buscar usuario por email
    */
    findByEmail: async (email) => {
        return await User.findOne({
            where: { correo: email }
        });
    },
    /**
     * Buscar usuario por ID
     */
    findById: async (id) => {
        return await User.findByPk(id);
    },
    /**
     * Crear nuevo usuario
     */
    create: async (data) => {
        return await User.create(data);
    },

    /**
     * Actualizar usuario existente
     */
    update: async (id, data) => {
        const user = await User.findByPk(id);
        if (!user) return null;
        return await user.update(data);
    },

    /**
     * Eliminación lógica (soft delete)
     */
    softDelete: async (id) => {
        const user = await User.findByPk(id);
        if (!user) return null;
        return await user.update({ estado: 'Inactivo' });
    },

    /**
     * Eliminación física (hard delete) - usar con precaución
     */
    delete: async (id) => {
        const user = await User.findByPk(id);
        if (!user) return null;
        await user.destroy();
        return true;
    },

    /**
     * Contar usuarios por estado
     */
    countByStatus: async (estado) => {
        return await User.count({
            where: { estado }
        });
    }
};
