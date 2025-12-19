import multer from "multer";
import fs from "fs";

// Pastikan folder uploads/berita ada
const path = "uploads/berita";
if (!fs.existsSync(path)) {
  fs.mkdirSync(path, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/berita/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

export const uploadBerita = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5 MB
});
