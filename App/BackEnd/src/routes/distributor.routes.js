import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
    getCurrentDistributorProfile,
    updateCurrentDistributorProfile
} from '../controllers/distributor.controller.js';
import { createCloudinaryStorage } from '../config/cloudinary.js';
import { createImageUpload } from '../config/upload.js';

const router = express.Router();
const upload = createImageUpload(createCloudinaryStorage('fotos distribuidores'));

router.get("/distributors/me", authMiddleware, getCurrentDistributorProfile);
router.put("/distributors/me", authMiddleware, upload.single('foto_avatar'), updateCurrentDistributorProfile);

export default router;
