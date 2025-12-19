import express from 'express';
import { registerPenyedia, loginPenyedia, getMyProfile } from "../controllers/penyediaAuthController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", registerPenyedia);
router.post("/login", loginPenyedia);

router.get("/me", authMiddleware, getMyProfile);
export default router;