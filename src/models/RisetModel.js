import pool from "../config/db.js";

class RisetModel {

  // ===============================
  // GET ALL RISET (JOIN KATEGORI)
  // ===============================
  static async getAll({ page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;

    const dataQuery = `
      SELECT 
        r.id,
        r.judul,
        r.nama_periset,
        r.kategori_id,
        k.nama_kategori,
        r.dokumen_url,
        r.created_at
      FROM riset r
      JOIN kategori k ON r.kategori_id = k.kategori_id
      ORDER BY r.created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const countQuery = `
      SELECT COUNT(*) 
      FROM riset r
      JOIN kategori k ON r.kategori_id = k.kategori_id
    `;

    const data = await pool.query(dataQuery, [limit, offset]);
    const total = (await pool.query(countQuery)).rows[0].count;

    return {
      data: data.rows,
      pagination: {
        total: Number(total),
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ===============================
  // GET RISET MILIK USER LOGIN
  // ===============================
  static async getByUserId(userId) {
    const result = await pool.query(
      `
      SELECT 
        r.id,
        r.judul,
        r.nama_periset,
        r.kategori_id,
        k.nama_kategori,
        r.dokumen_url,
        r.created_at
      FROM riset r
      JOIN kategori k ON r.kategori_id = k.kategori_id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
      `,
      [userId]
    );

    return result.rows;
  }

  // ===============================
  // GET RISET BY ID
  // ===============================
  static async getById(id) {
    const result = await pool.query(
      `
      SELECT 
        r.id,
        r.judul,
        r.nama_periset,
        r.kategori_id,
        k.nama_kategori,
        r.dokumen_url,
        r.user_id,
        r.created_at,
        r.updated_at
      FROM riset r
      JOIN kategori k ON r.kategori_id = k.kategori_id
      WHERE r.id = $1
      `,
      [id]
    );

    return result.rows[0];
  }

  // ===============================
  // CREATE RISET
  // ===============================
  static async create({ judul, namaPeriset, kategoriId, dokumenUrl, userId }) {
    const result = await pool.query(
      `
      INSERT INTO riset (
        judul,
        nama_periset,
        kategori_id,
        dokumen_url,
        user_id
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [judul, namaPeriset, kategoriId, dokumenUrl, userId]
    );

    return result.rows[0];
  }

  // ===============================
  // UPDATE RISET
  // ===============================
  static async update(id, { judul, namaPeriset, kategoriId, dokumenUrl }) {
    const result = await pool.query(
      `
      UPDATE riset
      SET
        judul = $1,
        nama_periset = $2,
        kategori_id = $3,
        dokumen_url = $4,
        updated_at = NOW()
      WHERE id = $5
      RETURNING *
      `,
      [judul, namaPeriset, kategoriId, dokumenUrl, id]
    );

    return result.rows[0];
  }

  // ===============================
  // DELETE RISET
  // ===============================
  static async delete(id) {
    const result = await pool.query(
      `DELETE FROM riset WHERE id = $1 RETURNING id`,
      [id]
    );

    return result.rows[0];
  }
}

export default RisetModel;
