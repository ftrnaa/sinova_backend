import {
  createKebutuhan,
  getAllKebutuhanByUser,
  getAllKebutuhanForPenyedia,
  updateKebutuhanByUser,
  deleteKebutuhanByUser,
  getPenyediaByKebutuhan,
} from "../models/kebutuhanModel.js";

/* ===============================
   CREATE (PENGGUNA)
================================ */
export const addKebutuhan = async (req, res) => {
  try {
    const data = req.body;

    if (!data.nama || !data.email || !data.kategori_id) {
      return res.status(400).json({
        message: "Nama, Email, dan Kategori wajib diisi",
      });
    }

    if (req.file) {
      data.dokumen = req.file.filename;
    }

    data.user_id = req.user.id;

    const result = await createKebutuhan(data);

    res.status(201).json({
      message: "Kebutuhan berhasil dibuat",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Gagal membuat kebutuhan",
    });
  }
};

/* ===============================
   READ RIWAYAT (PENGGUNA)
================================ */
export const fetchKebutuhan = async (req, res) => {
  try {
    const data = await getAllKebutuhanByUser(req.user.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   READ BY ID
================================ */
export const fetchKebutuhanById = async (req, res) => {
  try {
    const list = await getAllKebutuhanByUser(req.user.id);
    const kebutuhan = list.find(
      (k) => k.id === Number(req.params.id)
    );

    if (!kebutuhan) {
      return res.status(404).json({
        message: "Kebutuhan tidak ditemukan",
      });
    }

    res.json(kebutuhan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   UPDATE (PENGGUNA)
================================ */
export const editKebutuhan = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;

    if (req.file) {
      data.dokumen = req.file.filename;
    }

    const result = await updateKebutuhanByUser(
      id,
      req.user.id,
      data
    );

    if (!result) {
      return res.status(404).json({
        message: "Data tidak ditemukan atau bukan milik Anda",
      });
    }

    res.json({
      message: "Kebutuhan berhasil diupdate",
      data: result,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   DELETE (PENGGUNA)
================================ */
export const removeKebutuhan = async (req, res) => {
  try {
    const result = await deleteKebutuhanByUser(
      req.params.id,
      req.user.id
    );

    if (!result) {
      return res.status(404).json({
        message: "Data tidak ditemukan",
      });
    }

    res.json({
      message: "Kebutuhan berhasil dihapus",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   READ ALL (PENYEDIA)
================================ */
export const fetchAllKebutuhanForPenyedia = async (req, res) => {
  try {
    if (req.user.role !== "penyedia") {
      return res.status(403).json({ message: "Akses hanya untuk penyedia" });
    }

    const data = await getAllKebutuhanForPenyedia(req.user.id);

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ===============================
   FETCH PENYEDIA BERMINTA
================================ */
export const fetchPenyediaByKebutuhan = async (req, res) => {
  try {
    const data = await getPenyediaByKebutuhan(req.params.id);

    res.json({
      total: data.length,
      data,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
