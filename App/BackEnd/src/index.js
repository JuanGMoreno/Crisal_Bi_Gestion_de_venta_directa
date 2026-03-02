import app from "./app.js";
import express from 'express';
import { sequelize } from "./config/database.js";
import ProductRoutes from './routes/product.routes.js';
import cors from 'cors';
import './models/associations.js'; 

//middlewares
app.use(cors());
app.use(express.json());

//routes
app.use('/api', ProductRoutes); 

//tables definition
import './models/User.js';

//main function
async function main() {
    app.listen(4000);
    console.log("Server is running on port 4000");
    try {
        await sequelize.sync({ force: true });
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

main();
