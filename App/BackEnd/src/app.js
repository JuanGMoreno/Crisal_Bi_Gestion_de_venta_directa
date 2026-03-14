import express from 'express';
import cors from 'cors';
import productRoutes from './routes/product.routes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', productRoutes);

export default app;