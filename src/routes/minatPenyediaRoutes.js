import express from "express";
import multer from "multer";
import {
  ajukanProposal,
  getPeminatByKebutuhan,
  approvePenyedia
} from "../controllers/minatPenyediaController.js";
import { authMiddleware, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===============================
   MULTER CONFIG
================================ */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/proposal");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed =
      file.mimetype === "application/pdf" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.mimetype === "application/msword";

    if (!allowed) {
      return cb(new Error("File harus PDF atau Word"));
    }
    cb(null, true);
  },
});

/* ===============================
   ROUTES
================================ */

// penyedia ajukan proposal
router.post(
  "/",
  authMiddleware,
  checkRole("penyedia"),
  upload.single("proposal_file"),
  ajukanProposal
);

// pengguna lihat peminat berdasarkan kebutuhan
router.get(
  "/kebutuhan/:kebutuhanId",
  authMiddleware,
  checkRole("pengguna"),
  getPeminatByKebutuhan
);

// pengguna approve penyedia
router.post(
  "/:id/approve",
  authMiddleware,
  checkRole("pengguna"),
  approvePenyedia
);
export default router;