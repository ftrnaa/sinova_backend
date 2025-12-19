import pool from "../config/db.js";

class RisetModel {
  static async getAll(filters = {}) {
    const {
      judul = "",
      namaPeriset = "",
      kategori = "",
      page = 1,
      limit = 4,
    } = filters;

    const offset = (page - 1) * limit;

    let query = `
      SELECT id, judul, nama_periset, kategori_riset, dokumen_url, created_at, updated_at
      FROM riset
      WHERE 1=1
    `;

    const params = [];
    let count = 1;

    if (judul) {
      query += ` AND LOWER(judul) LIKE LOWER($${count})`;
      params.push(`%${judul}%`);
      count++;
    }

    if (namaPeriset) {
      query += ` AND LOWER(nama_periset) LIKE LOWER($${count})`;
      params.push(`%${namaPeriset}%`);
      count++;
    }

    if (kategori && kategori !== "Semua") {
      query += ` AND kategori_riset = $${count}`;
      params.push(kategori);
      count++;
    }

    const countQuery = `SELECT COUNT(*) AS total FROM (${query}) AS riset_filtered`;
    const total = (await pool.query(countQuery, params)).rows[0].total;

    query += ` ORDER BY created_at DESC LIMIT $${count} OFFSET $${count + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    return {
      data: result.rows,
      pagination: {
        total: Number(total),
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getById(id) {
    const result = await pool.query(
      `SELECT * FROM riset WHERE id=$1`,
      [id]
    );
    return result.rows[0];
  }

  static async create(data) {
    const { judul, namaPeriset, kategoriRiset, dokumentUrl } = data;

    const result = await pool.query(
      `
      INSERT INTO riset (judul, nama_periset, kategori_riset, dokumen_url)
      VALUES ($1,$2,$3,$4)
      RETURNING *
      `,
      [judul, namaPeriset, kategoriRiset, dokumentUrl]
    );

    return result.rows[0];
  }


  static async update(id, data) {
    const { judul, namaPeriset, kategoriRiset, dokumentUrl } = data;

    const result = await pool.query(
      `
      UPDATE riset
      SET 
        judul = COALESCE($1, judul),
        nama_periset = COALESCE($2, nama_periset),
        kategori_riset = COALESCE($3, kategori_riset),
        dokumen_url = COALESCE($4, dokumen_url),
        updated_at = NOW()
      WHERE id = $5
      RETURNING *
      `,
      [judul, namaPeriset, kategoriRiset, dokumentUrl, id]
    );

    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      `DELETE FROM riset WHERE id=$1 RETURNING id`,
      [id]
    );
    return result.rows[0];
  }

  static async getCategories() {
    const result = await pool.query(`
      SELECT DISTINCT kategori_riset
      FROM riset
      WHERE kategori_riset IS NOT NULL
      ORDER BY kategori_riset
    `);

    return result.rows.map((x) => x.kategori_riset);
  }

  static async getStats() {
    const result = await pool.query(`
      SELECT 
        COUNT(*) AS total_riset,
        COUNT(DISTINCT nama_periset) AS total_periset,
        COUNT(DISTINCT kategori_riset) AS total_kategori
      FROM riset
    `);

    return result.rows[0];
  }
}

export default RisetModel;
