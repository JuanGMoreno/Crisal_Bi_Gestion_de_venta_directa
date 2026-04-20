import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

//rutas
import productRoutes from './routes/product.routes.js';
import authRoutes from './routes/auth.routes.js';
import distributorRoutes from './routes/distributor.routes.js';
import clientRoutes from './routes/client.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';
import saleRoutes from './routes/sale.routes.js';
import docsRoutes from './routes/docs.routes.js';

const app = express();

const isDev = process.env.NODE_ENV !== 'production';
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

// Middlewares
app.use(
	cors({
		origin: isDev ? true : frontendUrl,
		credentials: true,
	})
);
app.use(morgan(isDev ? 'dev' : 'combined'));
app.use(express.json());  
app.use(cookieParser());

// Routes
app.use('/api', productRoutes);
app.use('/api', distributorRoutes);
app.use('/api', clientRoutes);
app.use('/api', inventoryRoutes);
app.use('/api', saleRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', docsRoutes);

app.use('/api/health', (_req, res) => {
  res.json({ message: 'API operativa' });
});

export default app;
