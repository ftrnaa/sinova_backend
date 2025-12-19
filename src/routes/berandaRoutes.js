import express from "express";
import { getBerandaStats } from "../controllers/berandaController.js";

const router = express.Router();

router.get("/stats", getBerandaStats);

export default router;
