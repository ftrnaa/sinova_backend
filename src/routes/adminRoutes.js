import express from "express";
import { loginAdmin } from "../controllers/adminAuthController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getAdminProfile } from "../controllers/adminAuthController.js";
const router = express.Router();

router.post("/login", loginAdmin);

router.get("/me", authMiddleware, getAdminProfile);

export default router;
