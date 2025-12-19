import pool from "../config/db.js";

export const getTotalUsulan = async () => {
  const res = await pool.query("SELECT COUNT(*) FROM kebutuhan");
  return parseInt(res.rows[0].count);
};

export const getUsulanBaru = async () => {
  const res = await pool.query("SELECT COUNT(*) FROM kebutuhan WHERE status='Menunggu'");
  return parseInt(res.rows[0].count);
};

export const getHistory = async () => {
  const res = await pool.query("SELECT COUNT(*) FROM kebutuhan WHERE status='Dikerjakan'");
  return parseInt(res.rows[0].count);
};

export const getStatusData = async () => {
  const res = await pool.query(`
    SELECT status, COUNT(*) AS jumlah
    FROM kebutuhan
    GROUP BY status
  `);

  const statusTemplate = [
    { name: "Menunggu", value: 0 },
    { name: "Dikerjakan", value: 0 },
  ];

  res.rows.forEach(row => {
    const index = statusTemplate.findIndex(s => s.name === row.status);
    if (index >= 0) statusTemplate[index].value = parseInt(row.jumlah);
  });

  return statusTemplate;
};

export const getDataBulan = async () => {
  const res = await pool.query(`
    SELECT TO_CHAR(created_at, 'Mon') AS bulan, COUNT(*) AS jumlah
    FROM kebutuhan
    GROUP BY bulan
    ORDER BY MIN(created_at)
  `);

  return res.rows.map(row => ({
    bulan: row.bulan,
    jumlah: parseInt(row.jumlah),
  }));
};
