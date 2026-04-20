import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  createInventory,
  deleteInventory,
  getInventory,
  getInventoryEntries,
  getInventoryEntry
} from '../controllers/inventory.controller.js';

const router = express.Router();

router.get('/inventory', authMiddleware, getInventory);
router.get('/inventory/entries', authMiddleware, getInventoryEntries);
router.get('/inventory/entries/:id', authMiddleware, getInventoryEntry);
router.post('/inventory/entries', authMiddleware, createInventory);
router.delete('/inventory/entries/:id', authMiddleware, deleteInventory);

export default router;
