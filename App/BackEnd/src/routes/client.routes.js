import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient
} from '../controllers/client.controller.js';

const router = express.Router();

router.get('/clients', authMiddleware, getClients);
router.get('/clients/:id', authMiddleware, getClient);
router.post('/clients', authMiddleware, createClient);
router.put('/clients/:id', authMiddleware, updateClient);
router.delete('/clients/:id', authMiddleware, deleteClient);

export default router;
