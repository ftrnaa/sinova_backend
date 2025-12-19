import express from "express";
import { authMiddleware, checkRole } from "../middleware/authMiddleware.js";
import {
  getDashboardAdmin,
  getLaporanDashboard,
} from "../controllers/dashboardadminController.js";

const router = express.Router();

router.get(
  "/dashboard-admin",
  authMiddleware,
  checkRole("admin"),
  getDashboardAdmin
);
// ==============================
// LAPORAN DASHBOARD (FILTER BULAN & TAHUN)
// ==============================
router.get(
  "/laporan/dashboard",
  authMiddleware,
  checkRole("admin"),
  getLaporanDashboard
);

export default router;
