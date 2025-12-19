import express from "express";
import { kirimOtp, verifikasiOtp, resetKataSandi } from "../controllers/lupaKataSandiController.js";

const router = express.Router();

router.post("/kirim-otp", kirimOtp);
router.post("/verifikasi-otp", verifikasiOtp);
router.post("/reset-kata-sandi", resetKataSandi);

export default router;
