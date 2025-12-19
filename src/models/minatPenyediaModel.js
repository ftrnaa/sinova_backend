import pool from "../config/db.js";

/* ===============================
   CREATE MINAT
================================ */
export const createMinatPenyedia = async ({
  kebutuhan_id,
  penyedia_id,
  deskripsi,
  proposal_file,
  estimasi_biaya,
  estimasi_waktu
}) => {
  const result = await pool.query(
    `
    INSERT INTO minat_penyedia
    (kebutuhan_id, penyedia_id, deskripsi, proposal_file, estimasi_biaya, estimasi_waktu, status)
    VALUES ($1, $2, $3, $4, $5, $6, 'menunggu')
    RETURNING *
    `,
    [
      kebutuhan_id,
      penyedia_id,
      deskripsi,
      proposal_file,
      estimasi_biaya,
      estimasi_waktu
    ]
  );

  return result.rows[0];
};


/* ===============================
   GET PEMINAT BY KEBUTUHAN
================================ */
export const getMinatByKebutuhan = async (kebutuhanId) => {
  const result = await pool.query(
    `
    SELECT
      mp.minat_id,
      mp.kebutuhan_id,
      mp.penyedia_id,
      mp.deskripsi,            
      mp.proposal_file,
      mp.tanggal_minat,
      mp.status,
      u.name AS nama,
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

/* ===============================
   APPROVE MINAT (WAJIB ADA)
================================ */
export const approveMinat = async (minatId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Ambil data minat
    const { rows } = await client.query(
      `
      SELECT kebutuhan_id, penyedia_id
      FROM minat_penyedia
      WHERE minat_id = $1
      `,
      [minatId]
    );

    if (!rows.length) {
      throw new Error("Minat tidak ditemukan");
    }

    const { kebutuhan_id, penyedia_id } = rows[0];

    // Terima penyedia terpilih
    await client.query(
      `
      UPDATE minat_penyedia
      SET status = 'diterima'
      WHERE minat_id = $1
      `,
      [minatId]
    );

    // Tolak penyedia lain
    await client.query(
      `
      UPDATE minat_penyedia
      SET status = 'ditolak'
      WHERE kebutuhan_id = $1 AND minat_id != $2
      `,
      [kebutuhan_id, minatId]
    );

    // Update kebutuhan
    await client.query(
      `
      UPDATE kebutuhan
      SET status = 'Sedang Dikerjakan',
          penyedia_dikerjakan = $1
      WHERE id = $2
      `,
      [penyedia_id, kebutuhan_id]
    );

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
