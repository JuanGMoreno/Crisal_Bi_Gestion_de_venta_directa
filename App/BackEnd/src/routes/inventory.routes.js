import express from 'express';
import {
    getInventory,
    createInventory,
    deleteInventory
} from '../controllers/inventory.controller.js';

const router = express.Router();

router.get("/inventory", getInventory);
router.post("/inventory", createInventory);
router.delete("/inventory/:id", deleteInventory);

export default router;