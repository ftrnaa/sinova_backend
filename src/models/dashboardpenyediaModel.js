import pool from "../config/db.js";

/**
 * Statistik produk milik penyedia
 */
export const getStatistikProdukPenyedia = async (userId) => {
  const query = `
    SELECT 
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE status = 'diterima') AS diterima,
      COUNT(*) FILTER (WHERE status = 'menunggu') AS menunggu,
      COUNT(*) FILTER (WHERE status = 'ditolak') AS ditolak
    FROM produk
    WHERE user_id = $1
  `;

  const result = await pool.query(query, [userId]);
  return result.rows[0];
};

/**
 * Daftar produk milik penyedia
 */
export const getProdukPenyedia = async (userId) => {
  const query = `
    SELECT 
      p.id,
      p.nama_produk,
      p.deskripsi,
      p.harga,
      p.kontak,
      p.foto_produk,
      p.status,
      p.alasan_penolakan,
      p.is_active,
      k.nama_kategori
    FROM produk p
    JOIN kategori k ON p.kategori_id = k.kategori_id
    WHERE p.user_id = $1
    ORDER BY p.id DESC
  `;

  const result = await pool.query(query, [userId]);
  return result.rows;
};
