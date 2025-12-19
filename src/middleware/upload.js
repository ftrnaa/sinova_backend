import multer from "multer";
import path from "path";
import fs from "fs";

// Folder upload
const uploadDir = "uploads/";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Konfigurasi storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  },
});

// Filter file (opsional)
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Format file tidak diizinkan"), false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;
