import "dotenv/config";

import app from "./app.js";
import { sequelize } from "./config/database.js";
import './models/index.js';

const PORT = Number(process.env.PORT || 4000);

function startServer(port, retries = 10) {
    const server = app.listen(port);

    server.once('listening', () => {
        console.log(`✓ Server running on http://localhost:${port}`);
    });

    server.once('error', (error) => {
        if (error.code === 'EADDRINUSE' && retries > 0) {
            const nextPort = port + 1;
            console.warn(`⚠ El puerto ${port} está en uso, intentando con ${nextPort}...`);
            startServer(nextPort, retries - 1);
            return;
        }

        console.error('✗ Error del servidor:', error);
        process.exit(1);
    });
}

async function main() {
    try {
        const shouldAlter = process.env.DB_SYNC_ALTER === 'true';

        if (!process.env.JWT_SECRET) {
            throw new Error('Falta JWT_SECRET en variables de entorno');
        }

        await sequelize.authenticate();
        await sequelize.sync({ alter: shouldAlter });
        console.log('✓ Database connected and models synchronized');
        
        // Iniciar servidor
        startServer(PORT);
    } catch (error) {
        console.error('✗ Unable to start server:', error);
        process.exit(1);
    }
}

main();
