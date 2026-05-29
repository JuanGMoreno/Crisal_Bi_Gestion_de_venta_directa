import "dotenv/config";

import app from "./app.js";
import { sequelize } from "./config/database.js";
import { migrator } from "./db/migrator.js";
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
        if (!process.env.JWT_SECRET) {
            throw new Error('Falta JWT_SECRET en variables de entorno');
        }

        await sequelize.authenticate();
        const pendingMigrations = await migrator.pending();

        if (pendingMigrations.length > 0) {
            console.warn(
                `Hay ${pendingMigrations.length} migracion(es) pendiente(s). Ejecuta npm run db:migrate antes de iniciar en un entorno real.`
            );
        }
        console.log('✓ Database connected');
        
        // Iniciar servidor
        startServer(PORT);
    } catch (error) {
        console.error('✗ Unable to start server:', error);
        process.exit(1);
    }
}

main();
