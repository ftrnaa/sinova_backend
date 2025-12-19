import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { findPenyediaByEmail, createPenyedia } from "../models/penyediaModel.js";

export const registerPenyedia = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const hashed = await bcrypt.hash(password, 10);
        const result = await createPenyedia(name, email, hashed);

        res.json({ message: "Register penyedia berhasil", user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT 
        u.id,
        u.name,
        u.email,
        u.foto_profil,
        u.no_handphone,
        r.role_name
      FROM users u
      JOIN role r ON u.role_id = r.id
      WHERE u.id = $1
      `,
      [userId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("getMyProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginPenyedia = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await findPenyediaByEmail(email);
        if (!result.rows.length) return res.status(400).json({ error: "User tidak ditemukan" });

        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ error: "Password salah" });

        const token = jwt.sign(
            { id: user.id, name: user.name, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ message: "Login berhasil", user: { id: user.id, name: user.name, role: user.role }, token });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};
