import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { loginController, meController, registerController } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", registerController);

router.post("/login", loginController);

router.get("/me", authMiddleware, meController);

export default router;