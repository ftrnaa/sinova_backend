import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

const router = express.Router();

// LOGIN UNIVERSAL
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = null;
    let role = null;

    // Cek pengguna
    const [pengguna] = await db.query(
      "SELECT * FROM pengguna WHERE email = $1",
      [email]
    );
    if (pengguna.length > 0) {
      user = pengguna[0];
      role = "pengguna";
    }

    // Cek penyedia
    if (!user) {
      const [penyedia] = await db.query(
        "SELECT * FROM penyedia WHERE email = $1",
        [email]
      );
      if (penyedia.length > 0) {
        user = penyedia[0];
        role = "penyedia";
      }
    }

    // Cek admin
    if (!user) {
      const [admin] = await db.query(
        "SELECT * FROM admin WHERE email = $1",
        [email]
      );
      if (admin.length > 0) {
        user = admin[0];
        role = "admin";
      }
    }

    // Jika tidak ditemukan
    if (!user) return res.status(404).json({ error: "Email tidak ditemukan" });

    // Cocokkan password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Password salah" });

    // Buat token
    const token = jwt.sign(
      { id: user.id, role },
      process.env.JWT_SECRET || "SECRET123",
      { expiresIn: "7d" }
    );

    res.json({ message: "Login berhasil", role, token });

  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan server", detail: error });
  }
});

export default router;
