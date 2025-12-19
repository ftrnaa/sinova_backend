import express from "express";
import { getDashboardPengguna } from "../controllers/dashboardPenggunaController.js";

const router = express.Router();

router.get("/dashboard-pengguna", getDashboardPengguna);

export default router;
