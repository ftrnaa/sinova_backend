import express from 'express';
import multer from 'multer';
import {
  fetchKebutuhan,
  fetchKebutuhanById,
  addKebutuhan,
  editKebutuhan,
  removeKebutuhan,
  fetchPenyediaByKebutuhan,
  fetchAllKebutuhanForPenyedia,
} from '../controllers/kebutuhanController.js';
import { authMiddleware, checkRole } from '../middleware/authMiddleware.js';

const upload = multer({ dest: "uploads/" });
const router = express.Router();

// Semua route harus login pengguna
router.get("/penyedia", authMiddleware, checkRole("penyedia"), fetchAllKebutuhanForPenyedia);

// 🔥 pindahkan ke atas
router.get("/:id/penyedia", authMiddleware, fetchPenyediaByKebutuhan);

router.get("/saya", authMiddleware, checkRole("pengguna"), fetchKebutuhan);
router.get("/:id", authMiddleware, fetchKebutuhanById);
router.post("/", authMiddleware, checkRole("pengguna"), upload.single("dokumen"), addKebutuhan);
router.put("/:id", authMiddleware, checkRole("pengguna"), upload.single("dokumen"), editKebutuhan);
router.delete("/:id", authMiddleware, checkRole("pengguna"), removeKebutuhan);


export default router;
