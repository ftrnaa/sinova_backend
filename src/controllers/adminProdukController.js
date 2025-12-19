import pool from '../config/db.js';
import { deleteFile } from '../utils/fileHelper.js';

// List semua produk (admin)
export const listProdukAdmin = async (req, res) => {
  try {
    const { status } = req.query;
    const params = [];
    let where = "";
    
    if (status) {
      where = "WHERE p.status = $1";
      params.push(status);
    }
    
    const query = `
      SELECT 
        p.*, 
        k.nama_kategori,
        u.name AS penyedia_name, 
        u.email AS penyedia_email,
        COALESCE(
          json_agg(
            json_build_object('id', pf.id, 'path', pf.foto_path)
          ) FILTER (WHERE pf.id IS NOT NULL),
          '[]'
        ) AS foto_list
      FROM produk p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN kategori k ON p.kategori_id = k.kategori_id
      LEFT JOIN produk_foto pf ON pf.produk_id = p.id
      ${where}
      GROUP BY p.id, k.nama_kategori, u.name, u.email
      ORDER BY p.created_at DESC
    `;
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error listProdukAdmin:', err);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat mengambil produk', 
      error: err.message 
    });
  }
};

// Approve produk
export const approveProduk = async (req, res) => {
  try {
    const result = await pool.query(`
      UPDATE produk
      SET status='diterima', approved_by=$1, approved_at=NOW(), alasan_penolakan=NULL
      WHERE id=$2
      RETURNING *
    `, [req.user.id, req.params.id]);
    
    if (!result.rows.length) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
    
    res.json({ message: 'Produk diterima', produk: result.rows[0] });
  } catch (err) {
    console.error('Error approveProduk:', err);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat approve produk', 
      error: err.message 
    });
  }
};

// Reject produk
export const rejectProduk = async (req, res) => {
  try {
    const { alasan_penolakan } = req.body;
    
    if (!alasan_penolakan || alasan_penolakan.trim() === '') {
      return res.status(400).json({ message: 'Alasan penolakan harus diisi' });
    }
    
    const result = await pool.query(`
      UPDATE produk
      SET status='ditolak', alasan_penolakan=$1, updated_at=NOW()
      WHERE id=$2
      RETURNING *
    `, [alasan_penolakan, req.params.id]);
    
    if (!result.rows.length) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
    
    res.json({ message: 'Produk ditolak', produk: result.rows[0] });
  } catch (err) {
    console.error('Error rejectProduk:', err);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat menolak produk', 
      error: err.message 
    });
  }
};

// Hapus produk (admin)
export const deleteProduk = async (req, res) => {
  try {
    // Ambil data produk beserta foto
    const produkData = await pool.query(
      "SELECT * FROM produk WHERE id = $1",
      [req.params.id]
    );

    if (!produkData.rows.length) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    // Hapus foto utama
    if (produkData.rows[0].foto_produk) {
      deleteFile(produkData.rows[0].foto_produk);
    }

    // Hapus foto tambahan
    const fotoList = await pool.query(
      "SELECT foto_path FROM produk_foto WHERE produk_id = $1",
      [req.params.id]
    );

    for (const foto of fotoList.rows) {
      deleteFile(foto.foto_path);
    }

    // Hapus dari database
    await pool.query("DELETE FROM produk WHERE id=$1", [req.params.id]);
    
    res.json({ message: 'Produk berhasil dihapus' });
  } catch (err) {
    console.error('Error deleteProduk:', err);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat menghapus produk', 
      error: err.message 
    });
  }
};