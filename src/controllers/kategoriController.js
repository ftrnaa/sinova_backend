import pool from "../config/db.js";

export const getAllKategori = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM kategori ORDER BY kategori_id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetch kategori:", err);
    res.status(500).json({ message: "Gagal fetch kategori" });
  }
};
