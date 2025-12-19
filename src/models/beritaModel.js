import pool from "../config/db.js";

// ===============================
// GET ALL BERITA
// ===============================
export const getAllBeritaQuery = async () => {
  const result = await pool.query("SELECT * FROM berita ORDER BY id DESC");
  return result.rows;
};

// ===============================
// GET BERITA BY ID
// ===============================
export const getBeritaByIdQuery = async (id) => {
  const result = await pool.query("SELECT * FROM berita WHERE id = $1", [id]);
  return result.rows[0];
};

// ===============================
// CREATE BERITA
// ===============================
export const createBeritaQuery = async (
  judul,
  isi,
  thumbnail,
  status,
  link
) => {
  const result = await pool.query(
    `INSERT INTO berita (judul, isi, thumbnail, status, link)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [judul, isi, thumbnail, status, link]
  );

  return result.rows[0];
};


// ===============================
// UPDATE BERITA
// ===============================
export const updateBeritaQuery = async (
  id,
  judul,
  isi,
  thumbnail,
  status,
  link
) => {
  const result = await pool.query(
    `UPDATE berita 
     SET judul = $1,
         isi = $2,
         thumbnail = COALESCE($3, thumbnail),
         status = $4,
         link = $5
     WHERE id = $6
     RETURNING *`,
    [judul, isi, thumbnail, status, link, id]
  );

  return result.rows[0];
};


// ===============================
// DELETE BERITA
// ===============================
export const deleteBeritaQuery = async (id) => {
  const result = await pool.query(
    `DELETE FROM berita WHERE id = $1 RETURNING *`,
    [id]
  );

  return result.rows[0];
};
