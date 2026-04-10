import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { loginController, meController, registerController, signoutController } from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", registerController);

router.post("/signin", loginController);

router.post("/signout", signoutController);

router.get("/me", authMiddleware, meController);

export default router;