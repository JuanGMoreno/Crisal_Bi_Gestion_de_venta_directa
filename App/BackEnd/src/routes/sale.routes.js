import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  getSales,
  getSale,
  createSale,
  updateSale,
  updateSaleStatus,
  deleteSale
} from '../controllers/sale.controller.js';

const router = express.Router();

router.get('/sales', authMiddleware, getSales);
router.get('/sales/:id', authMiddleware, getSale);
router.post('/sales', authMiddleware, createSale);
router.put('/sales/:id', authMiddleware, updateSale);
router.patch('/sales/:id/status', authMiddleware, updateSaleStatus);
router.delete('/sales/:id', authMiddleware, deleteSale);

export default router;
