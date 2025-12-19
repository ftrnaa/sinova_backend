import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findAdminByEmail, createAdmin } from "../models/adminModel.js";
import pool from "../config/db.js";
// ==============================
// LOGIN ADMIN
// ==============================

export const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id; // diambil dari JWT auth middleware

    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.no_handphone, u.foto_profil, r.role_name AS role
       FROM users u
       JOIN role r ON u.role_id = r.id
       WHERE u.id = $1 AND r.role_name = 'admin'`,
      [adminId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Admin tidak ditemukan" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("ERROR GET ADMIN PROFILE:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await findAdminByEmail(email);
        if (!admin) {
            return res.status(400).json({ error: "Admin tidak ditemukan" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Password salah" });
        }

        const token = jwt.sign(
            { id: admin.id, role: admin.role, name: admin.name },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login admin berhasil",
            user: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
            token,
        });
    } catch (err) {
        console.error("ERROR LOGIN ADMIN:", err);
        res.status(500).json({ error: "Server error" });
    }
};
