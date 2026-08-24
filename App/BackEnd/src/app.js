import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { sequelize } from './config/database.js';

//rutas
import productRoutes from './routes/product.routes.js';
import authRoutes from './routes/auth.routes.js';
import distributorRoutes from './routes/distributor.routes.js';
import clientRoutes from './routes/client.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';
import saleRoutes from './routes/sale.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import docsRoutes from './routes/docs.routes.js';
import { errorMiddleware, notFoundMiddleware } from './middleware/error.middleware.js';
import {
	authRateLimiter,
	apiRateLimiter,
	corsOptions,
	originProtectionMiddleware,
	requestLoggerMiddleware
} from './middleware/security.middleware.js';

const app = express();

const isDev = process.env.NODE_ENV !== 'production';

if (!isDev) {
	app.set('trust proxy', 1);
}

// Middlewares
app.use(helmet({
	contentSecurityPolicy: false,
	crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors(corsOptions));
app.use(requestLoggerMiddleware);
app.use(express.json({ limit: '250kb' }));
app.use(cookieParser());
app.use(originProtectionMiddleware);
app.use('/api', apiRateLimiter);
app.use(['/api/auth/signin', '/api/auth/signup'], authRateLimiter);

// Routes
app.use('/api', productRoutes);
app.use('/api', distributorRoutes);
app.use('/api', clientRoutes);
app.use('/api', inventoryRoutes);
app.use('/api', saleRoutes);
app.use('/api', dashboardRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', docsRoutes);

app.use('/api/health', async (_req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ message: 'API operativa', database: 'connected' });
  } catch (_error) {
    res.status(503).json({ message: 'API no disponible', database: 'disconnected' });
  }
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
