import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { loginController, meController, registerController } from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", registerController);

router.post("/signin", loginController);

router.get("/me", authMiddleware, meController);

export default router;