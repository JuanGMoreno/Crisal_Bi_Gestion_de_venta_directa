import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
    getDistributors,
    getDistributor,
    createDistributor,
    updateDistributor,
    deleteDistributor
} from '../controllers/distributor.controller.js';

const router = express.Router();

router.get("/distributors", authMiddleware, getDistributors);
router.get("/distributors/:id", authMiddleware, getDistributor);
router.post("/distributors", authMiddleware, createDistributor);
router.put("/distributors/:id", authMiddleware, updateDistributor);
router.delete("/distributors/:id", authMiddleware, deleteDistributor);

export default router;
