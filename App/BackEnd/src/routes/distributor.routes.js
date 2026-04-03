import express from 'express';
import {
    getDistributors,
    getDistributor,
    createDistributor,
    updateDistributor,
    deleteDistributor
} from '../controllers/distributor.controller.js';

const router = express.Router();

router.get("/distributors", getDistributors);
router.get("/distributors/:id", getDistributor);
router.post("/distributors", createDistributor);
router.put("/distributors/:id", updateDistributor);
router.delete("/distributors/:id", deleteDistributor);

export default router;