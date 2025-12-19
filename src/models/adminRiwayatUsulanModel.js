import pool from "../config/db.js";

export const getRiwayatUsulanAdminModel = () => {
  return pool.query(`
    SELECT
      k.id AS kebutuhan_id,
      u.name AS nama_pengguna,
      k.nama AS judul_usulan,
      k.deskripsi,
      k.status,
      k.status_detail,
      COALESCE(p.name, '-') AS penyedia_dikerjakan,
      k.tanggal_kebutuhan
    FROM kebutuhan k
    JOIN users u ON k.pengguna_id = u.id
    LEFT JOIN users p ON k.penyedia_dikerjakan = p.id
    ORDER BY k.tanggal_kebutuhan DESC
  `);
};
