const express = require("express");
const cors = require("cors");
const pool = require("./db"); // koneksi database

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// ROUTE IMPORT (HARUS DARI FOLDER src/routes)
const penggunaRoutes = require("./src/routes/penggunaRoutes");
const penyediaRoutes = require("./src/routes/penyediaRoutes");

// ROUTE UTAMA
app.get("/", (req, res) => {
  res.send("SINOVA Backend Running");
});

// REGISTER ROUTES
app.use("/auth/pengguna", penggunaRoutes);
app.use("/auth/penyedia", penyediaRoutes);

// PRODUK ROUTES
app.get("/produk", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM produk");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/produk", async (req, res) => {
  try {
    const { nama_produk, deskripsi, penyedia_id } = req.body;

    if (!nama_produk || !deskripsi || !penyedia_id) {
      return res.status(400).json({ error: "Semua field wajib diisi" });
    }

    const result = await pool.query(
      `INSERT INTO produk (nama_produk, deskripsi, penyedia_id, status_verifikasi)
      VALUES ($1, $2, $3, 'menunggu') RETURNING *`,
      [nama_produk, deskripsi, penyedia_id]
    );

    res.json({
      message: "Produk berhasil ditambahkan",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// START SERVER
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
