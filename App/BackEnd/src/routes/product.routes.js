import express from 'express';
import { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/product.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/products", authMiddleware, getProducts);
router.get("/products/:id", authMiddleware, getProduct);
router.post("/products", authMiddleware, createProduct);
router.put("/products/:id", authMiddleware, updateProduct);
router.delete("/products/:id", authMiddleware, deleteProduct);

export default router;