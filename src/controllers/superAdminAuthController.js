import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { createAdmin } from "../models/superadminModel.js";

export const loginSuperadmin = async (req, res) => {
    const { email, password } = req.body;

    const result = await pool.query(
        "SELECT * FROM users WHERE email=$1 AND role='superadmin'",
        [email]
    );
    if (!result.rows.length) {
        return res.status(400).json({ error: "Superadmin tidak ditemukan" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Password salah" });

    const token = jwt.sign(
        { id: user.id, role: user.role, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({
        message: "Login Superadmin berhasil",
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        token
    });
};

export const createAdminBySuperadmin = async (req, res) => {
    const { name, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);
    const newAdmin = await createAdmin(name, email, hashed);

    res.json({
        message: "Admin berhasil dibuat oleh Superadmin",
        admin: newAdmin
    });
};
