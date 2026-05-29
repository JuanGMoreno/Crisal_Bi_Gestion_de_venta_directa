import express from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
    getDistributors,
    getDistributor,
    getCurrentDistributorProfile,
    updateCurrentDistributorProfile,
    renewCurrentDistributorReferralCode,
    linkCurrentDistributorByReferralCode,
    getCurrentDistributorChildren,
    createDistributor,
    updateDistributor,
    deleteDistributor
} from '../controllers/distributor.controller.js';
import { createCloudinaryStorage } from '../config/cloudinary.js';

const router = express.Router();
const upload = multer({ storage: createCloudinaryStorage('fotos distribuidores') });

router.get("/distributors", authMiddleware, getDistributors);
router.get("/distributors/me", authMiddleware, getCurrentDistributorProfile);
router.put("/distributors/me", authMiddleware, upload.single('foto_avatar'), updateCurrentDistributorProfile);
router.post("/distributors/me/referral-code", authMiddleware, renewCurrentDistributorReferralCode);
router.post("/distributors/me/link-referral", authMiddleware, linkCurrentDistributorByReferralCode);
router.get("/distributors/me/children", authMiddleware, getCurrentDistributorChildren);
router.get("/distributors/:id", authMiddleware, getDistributor);
router.post("/distributors", authMiddleware, createDistributor);
router.put("/distributors/:id", authMiddleware, updateDistributor);
router.delete("/distributors/:id", authMiddleware, deleteDistributor);

export default router;
