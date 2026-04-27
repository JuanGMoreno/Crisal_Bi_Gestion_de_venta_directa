import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { getDashboard } from '../controllers/dashboard.controller.js';

const router = express.Router();

router.get('/dashboard', authMiddleware, getDashboard);

export default router;
