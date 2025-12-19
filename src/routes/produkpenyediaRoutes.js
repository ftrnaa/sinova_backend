import express from "express";
import * as produkController from "../controllers/produkPenyediaController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { uploadProdukFoto } from "../middleware/uploadProduk.js";

const router = express.Router();

router.use(authMiddleware);

// ➕ tambah produk
router.post("/", uploadProdukFoto, produkController.storeProduk);

// 📄 list produk
router.get("/", produkController.listProduk);

// ✏️ edit produk
router.put("/:id", uploadProdukFoto, produkController.updateProduk);
router.get("/:id", produkController.detailProduk);

// 🗑️ hapus produk
router.delete("/:id", produkController.deleteProduk);

export default router;
