import express from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient
} from '../controllers/client.controller.js';
import { createCloudinaryStorage } from '../config/cloudinary.js';

const router = express.Router();
const upload = multer({ storage: createCloudinaryStorage('fotos clientes') });

router.get('/clients', authMiddleware, getClients);
router.get('/clients/:id', authMiddleware, getClient);
router.post('/clients', authMiddleware, upload.single('foto_avatar'), createClient);
router.put('/clients/:id', authMiddleware, upload.single('foto_avatar'), updateClient);
router.delete('/clients/:id', authMiddleware, deleteClient);

export default router;
