import app from "./app.js";
import { sequelize } from "./config/database.js";
import './models/index.js';

const PORT = process.env.PORT || 4000;

async function main() {
    try {
        await sequelize.sync({ alter: true });
        console.log('✓ Database connected and models synchronized');
        
        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`✓ Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('✗ Unable to start server:', error);
        process.exit(1);
    }
}

main();
