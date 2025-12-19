import express from "express";
import { authMiddleware, checkRole } from "../middleware/authMiddleware.js";
import { getDashboardPenyedia } from "../controllers/dashboardpenyediaController.js";

const router = express.Router();

router.get(
  "/dashboardpenyedia",
  authMiddleware,
  checkRole("penyedia"),
  getDashboardPenyedia
);

export default router;
