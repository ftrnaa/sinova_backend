import {
  getAllBeritaQuery,
  getBeritaByIdQuery,
  createBeritaQuery,
  updateBeritaQuery,
  deleteBeritaQuery,
} from "../models/beritaModel.js";

// ===============================
// GET ALL BERITA
// ===============================
export const getAllBerita = async (req, res) => {
  try {
    const berita = await getAllBeritaQuery();
    res.json({ success: true, data: berita });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===============================
// GET BERITA BY ID
// ===============================
export const getBeritaById = async (req, res) => {
  try {
    const berita = await getBeritaByIdQuery(req.params.id);
    if (!berita) {
      return res.status(404).json({
        success: false,
        message: "Berita tidak ditemukan",
      });
    }

    res.json({ success: true, data: berita });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===============================
// CREATE BERITA
// ===============================
export const createBerita = async (req, res) => {
  try {
    const { judul, isi, status, link } = req.body;

    if (!link) {
      return res.status(400).json({
        success: false,
        message: "Link berita wajib diisi",
      });
    }

    const thumbnail = req.file
      ? `http://localhost:5000/uploads/berita/${req.file.filename}`
      : null;

    // ✅ link ikut dikirim
    const berita = await createBeritaQuery(
      judul,
      isi,
      thumbnail,
      status,
      link
    );

    res.json({
      success: true,
      message: "Berita berhasil ditambahkan",
      data: berita,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===============================
// UPDATE BERITA
// ===============================
export const updateBerita = async (req, res) => {
  try {
    const { judul, isi, status, link } = req.body;


    const thumbnail = req.file
      ? `http://localhost:5000/uploads/berita/${req.file.filename}`
      : null;

    const berita = await updateBeritaQuery(
  req.params.id,
  judul,
  isi,
  thumbnail,
  status,
  link
);


    res.json({
      success: true,
      message: "Berita berhasil diperbarui",
      data: berita,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===============================
// DELETE BERITA
// ===============================
export const deleteBerita = async (req, res) => {
  try {
    const berita = await deleteBeritaQuery(req.params.id);

    res.json({
      success: true,
      message: "Berita berhasil dihapus",
      data: berita,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
