import express from "express";
import { authMiddleware, checkRole } from "../middleware/authMiddleware.js";
import { getRiwayatUsulanAdmin } from "../controllers/adminRiwayatUsulanController.js";

const router = express.Router();

// RIWAYAT USULAN ADMIN (VIEW ONLY)
router.get(
  "/riwayat-usulan",
  authMiddleware,
  checkRole("admin"),
  getRiwayatUsulanAdmin
);

export default router;
