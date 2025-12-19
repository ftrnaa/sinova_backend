import express from "express";
import { registerPengguna, loginPengguna, getPenggunaProfile } from "../controllers/penggunaAuthController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// REGISTER
router.post("/register", registerPengguna);

// LOGIN
router.post("/login", loginPengguna);

// GET PROFILE
router.get("/me", authMiddleware, getPenggunaProfile);

export default router;
