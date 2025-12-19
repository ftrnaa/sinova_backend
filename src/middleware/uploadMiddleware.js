import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Tentukan direktori penyimpanan
const uploadDir = path.join(process.cwd(), 'uploads/dokumen_layanan');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi penyimpanan Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // userId didapat dari JWT, jika tersedia di req.user
        const userId = req.user ? req.user.id : 'anon';
        const fileExt = path.extname(file.originalname);
        const fileName = `${userId}_${Date.now()}${fileExt}`;
        cb(null, fileName);
    },
});

// Konfigurasi Multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Batasan 10MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|doc|docx|zip/;
        const mimeType = allowedTypes.test(file.mimetype);
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

        if (mimeType && extname) {
            return cb(null, true);
        }
        cb(new Error('Hanya diperbolehkan file PDF, DOC/DOCX, atau ZIP.'));
    },
});

// Middleware untuk mengunggah satu file (dokumen)
export const uploadDokumen = upload.single('dokumen');