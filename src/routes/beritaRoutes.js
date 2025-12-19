import express from "express";
import {
  getAllBerita,
  getBeritaById,
  createBerita,
  updateBerita,
  deleteBerita,
} from "../controllers/beritaController.js";

import { uploadBerita } from "../middleware/uploadBerita.js";

const router = express.Router();

// GET all berita
router.get("/", getAllBerita);

// GET berita by ID
router.get("/:id", getBeritaById);

// CREATE berita
router.post("/", uploadBerita.single("thumbnail"), createBerita);

// UPDATE berita
router.put("/:id", uploadBerita.single("thumbnail"), updateBerita);

// DELETE berita
router.delete("/:id", deleteBerita);

export default router;
