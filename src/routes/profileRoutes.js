import express from "express";
import multer from "multer";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getMyProfile, updateProfile } from "../controllers/profileController.js";

// lokasi penyimpanan foto profil
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile/");
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname);
  }
});

const upload = multer({ storage });

const router = express.Router();

/*
|--------------------------------------------------------------------------
|   ROUTES PROFIL
|--------------------------------------------------------------------------
*/

// ✔ Ambil data profil user yang sedang login
router.get("/me", authMiddleware, getMyProfile);

// ✔ Update profil (nama, no_handphone, foto)
router.put(
  "/update",
  authMiddleware,
  upload.single("foto_profil"),
  updateProfile
);


export default router;
