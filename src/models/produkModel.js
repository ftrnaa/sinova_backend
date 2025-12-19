import pool from '../config/db.js';

// Tambah produk baru
export const createProduk = async ({ user_id, nama_produk, kategori_id, deskripsi, harga, kontak, foto_produk }) => {
  const res = await pool.query(`
    INSERT INTO produk (user_id, nama_produk, kategori_id, deskripsi, harga, kontak, foto_produk, status)
    VALUES ($1,$2,$3,$4,$5,$6,$7,'menunggu')
    RETURNING *
  `, [user_id, nama_produk, kategori_id, deskripsi, harga, kontak, foto_produk]);
  return res.rows[0];
};

// Ambil semua produk milik penyedia
export const listProdukByUser = async (user_id) => {
  const res = await pool.query(`
    SELECT 
      p.*,
      k.nama_kategori,
      u.name AS penyedia_name,
      u.email AS penyedia_email
    FROM produk p
    JOIN users u ON p.user_id = u.id
    LEFT JOIN kategori k ON p.kategori_id = k.id
    WHERE p.user_id = $1
    ORDER BY p.created_at DESC
  `, [user_id]);

  return res.rows;
};


// Cari produk berdasarkan ID
export const findProdukById = async (id) => {
  const res = await pool.query(`SELECT * FROM produk WHERE id = $1`, [id]);
  return res.rows[0];
};

// Update produk
export const updateProduk = async (id, data) => {
  const { nama_produk, kategori_id, deskripsi, harga, kontak, foto_produk, status, alasan_penolakan } = data;
  const res = await pool.query(`
    UPDATE produk
    SET nama_produk=$1, kategori_id=$2, deskripsi=$3, harga=$4, kontak=$5,
        foto_produk=$6, status=$7, alasan_penolakan=$8
    WHERE id=$9
    RETURNING *
  `, [nama_produk, kategori_id, deskripsi, harga, kontak, foto_produk, status, alasan_penolakan, id]);
  return res.rows[0];
};

// Hapus produk
export const deleteProduk = async (id) => {
  const res = await pool.query(`DELETE FROM produk WHERE id=$1 RETURNING *`, [id]);
  return res.rows[0];
};
