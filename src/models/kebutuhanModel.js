import pool from "../config/db.js";

/* ===============================
   CREATE KEBUTUHAN
================================ */
export const createKebutuhan = async (data) => {
  const query = `
    INSERT INTO kebutuhan (
      nama, alamat, email, telp, jabatan,
      nama_perusahaan, email_perusahaan, alamat_perusahaan, telp_perusahaan,
      jenis_produk, deskripsi, tanggal_kebutuhan,
      estimasi_budget, dokumen, kategori_id,
      pengguna_id, status, status_detail
    )
    VALUES (
      $1,$2,$3,$4,$5,
      $6,$7,$8,$9,
      $10,$11,$12,
      $13,$14,$15,
      $16,'Menunggu','Menunggu penyedia'
    )
    RETURNING *;
  `;

  const values = [
    data.nama,
    data.alamat,
    data.email,
    data.telp,
    data.jabatan,
    data.nama_perusahaan,
    data.email_perusahaan,
    data.alamat_perusahaan,
    data.telp_perusahaan,
    data.jenis_produk,
    data.deskripsi,
    data.tanggal_kebutuhan,
    data.estimasi_budget,
    data.dokumen || null,
    data.kategori_id,
    data.user_id,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

/* ===============================
   READ RIWAYAT PENGGUNA
================================ */
export const getAllKebutuhanByUser = async (userId) => {
  const result = await pool.query(
    `
    SELECT
      k.*,
      c.nama_kategori,
      COALESCE(mp.peminat,0) AS peminat
    FROM kebutuhan k
    LEFT JOIN kategori c ON k.kategori_id = c.kategori_id
    LEFT JOIN (
      SELECT kebutuhan_id, COUNT(*) AS peminat
      FROM minat_penyedia
      GROUP BY kebutuhan_id
    ) mp ON mp.kebutuhan_id = k.id
    WHERE k.pengguna_id = $1
    ORDER BY k.created_at DESC
    `,
    [userId]
  );

  return result.rows;
};

/* ===============================
   READ SEMUA (UNTUK PENYEDIA)
================================ */
export const getAllKebutuhanForPenyedia = async (penyediaId) => {
  const result = await pool.query(`
    SELECT
      k.*,
      c.nama_kategori,
      COALESCE(mp.status, 'belum_mengajukan') AS status_minat
    FROM kebutuhan k
    JOIN kategori c ON k.kategori_id = c.kategori_id
    LEFT JOIN minat_penyedia mp
      ON mp.kebutuhan_id = k.id
      AND mp.penyedia_id = $1
    ORDER BY k.created_at DESC
  `, [penyediaId]);

  return result.rows;
};

/* ===============================
   UPDATE OLEH PEMILIK
================================ */
export const updateKebutuhanByUser = async (id, userId, data) => {
  const query = `
    UPDATE kebutuhan SET
      nama=$1,
      alamat=$2,
      email=$3,
      telp=$4,
      jabatan=$5,
      nama_perusahaan=$6,
      email_perusahaan=$7,
      alamat_perusahaan=$8,
      telp_perusahaan=$9,
      jenis_produk=$10,
      deskripsi=$11,
      tanggal_kebutuhan=$12,
      estimasi_budget=$13,
      dokumen=$14,
      kategori_id=$15
    WHERE id=$16 AND pengguna_id=$17
    RETURNING *;
  `;

  const values = [
    data.nama,
    data.alamat,
    data.email,
    data.telp,
    data.jabatan,
    data.nama_perusahaan,
    data.email_perusahaan,
    data.alamat_perusahaan,
    data.telp_perusahaan,
    data.jenis_produk,
    data.deskripsi,
    data.tanggal_kebutuhan,
    data.estimasi_budget,
    data.dokumen || null,
    data.kategori_id,
    id,
    userId,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

/* ===============================
   DELETE
================================ */
export const deleteKebutuhanByUser = async (id, userId) => {
  const result = await pool.query(
    `DELETE FROM kebutuhan WHERE id=$1 AND pengguna_id=$2 RETURNING *`,
    [id, userId]
  );
  return result.rows[0];
};

/* ===============================
   FETCH PENYEDIA BERMINTA
================================ */
export const getPenyediaByKebutuhan = async (kebutuhanId) => {
  const result = await pool.query(
    `
    SELECT
      mp.minat_id,
      mp.proposal,
      mp.estimasi_biaya,
      mp.estimasi_waktu,
      mp.tanggal_minat,
      u.id AS penyedia_id,
      u.nama,
      u.email
    FROM minat_penyedia mp
    JOIN users u ON u.id = mp.penyedia_id
    WHERE mp.kebutuhan_id = $1
    ORDER BY mp.tanggal_minat DESC
    `,
    [kebutuhanId]
  );

  return result.rows;
};
