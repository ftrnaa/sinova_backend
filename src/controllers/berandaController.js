import pool from '../config/db.js';

export const getBerandaStats = async (req, res) => {
  try {
    // total semua produk
    const totalResult = await pool.query('SELECT COUNT(*) FROM produk');
    const total = Number(totalResult.rows[0].count);

    // total produk diverifikasi
    const diverifikasiResult = await pool.query(
      "SELECT COUNT(*) FROM produk WHERE status='diterima'"
    );
    const diverifikasi = Number(diverifikasiResult.rows[0].count);

    // bisa tambah statistik lain di sini, misal total kategori, total user, dsb.

    res.json({ total, diverifikasi });
  } catch (err) {
    console.error('Error getBerandaStats:', err);
    res.status(500).json({ message: 'Gagal ambil statistik beranda', error: err.message });
  }
};
