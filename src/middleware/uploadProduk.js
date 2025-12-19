import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/produk"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

export const uploadProdukFoto = multer({ storage }).array("foto_produk", 10);
