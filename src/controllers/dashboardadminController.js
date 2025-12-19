import pool from "../config/db.js";

// ==============================
// DASHBOARD ADMIN
// ==============================
export const getDashboardAdmin = async (req, res) => {
  try {
    // ======================
    // Statistik utama
    // ======================
    const statistikResult = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM produk) AS "totalProduk",
        (SELECT COUNT(*) FROM "users") AS "totalPengguna",
        (
          SELECT COUNT(*)
          FROM "users" u
          JOIN role r ON r.id = u.role_id
          WHERE r.role_name = 'penyedia'
        ) AS "totalPenyedia"
    `);

    // ======================
    // Produk per kategori
    // ======================
    const kategoriResult = await pool.query(`
      SELECT
        k.nama_kategori AS kategori,
        COUNT(p.id) AS jumlah
      FROM kategori k
      LEFT JOIN produk p ON p.kategori_id = k.kategori_id
      GROUP BY k.nama_kategori
      ORDER BY k.nama_kategori
    `);

    // ======================
    // Pengajuan per bulan (DIPERBAIKI)
    // ======================
    const pengajuanResult = await pool.query(`
      SELECT
        TO_CHAR(p.created_at, 'Mon') AS bulan,
        COUNT(*) AS jumlah,
        COUNT(*) FILTER (WHERE p.status = 'diterima') AS diterima,
        COUNT(*) FILTER (WHERE p.status = 'ditolak') AS ditolak
      FROM produk p
      WHERE p.created_at >= NOW() - INTERVAL '6 months'
      GROUP BY TO_CHAR(p.created_at, 'Mon'), EXTRACT(MONTH FROM p.created_at)
      ORDER BY EXTRACT(MONTH FROM p.created_at)
    `);

    res.json({
      statistik: statistikResult.rows[0],
      kategori: kategoriResult.rows,
      pengajuan: pengajuanResult.rows,
    });
  } catch (error) {
    console.error("ERROR DASHBOARD ADMIN 👉", error.message);
    res.status(500).json({
      message: "Gagal mengambil data dashboard admin",
      error: error.message,
    });
  }
};

// ==============================
// LAPORAN DASHBOARD (FILTER)
// ==============================
export const getLaporanDashboard = async (req, res) => {
  try {
    const { bulan, tahun } = req.query;
    let conditions = [];
    let values = [];

    if (bulan) {
      values.push(bulan);
      conditions.push(
        `EXTRACT(MONTH FROM p.created_at) = $${values.length}`
      );
    }

    if (tahun) {
      values.push(tahun);
      conditions.push(
        `EXTRACT(YEAR FROM p.created_at) = $${values.length}`
      );
    }

    const whereClause =
      conditions.length > 0
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    const query = `
      SELECT
        p.nama_produk,
        k.nama_kategori,
        p.status,
        p.created_at
      FROM produk p
      JOIN kategori k ON k.kategori_id = p.kategori_id
      ${whereClause}
      ORDER BY p.created_at DESC
    `;

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error("ERROR LAPORAN DASHBOARD 👉", error.message);
    res.status(500).json({
      message: "Gagal mengambil laporan dashboard",
      error: error.message,
    });
  }
};