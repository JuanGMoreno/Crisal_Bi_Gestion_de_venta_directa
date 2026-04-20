import express from 'express';
import { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/product.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import multer from 'multer';
import storage from '../config/cloudinary.js';

const router = express.Router();
const upload = multer({ storage });

router.get("/products", authMiddleware, getProducts);
router.get("/products/:id", authMiddleware, getProduct);
router.post("/products", authMiddleware, upload.single('foto_avatar'), createProduct);
router.put("/products/:id", authMiddleware, upload.single('foto_avatar'), updateProduct);
router.delete("/products/:id", authMiddleware, deleteProduct);

export default router;