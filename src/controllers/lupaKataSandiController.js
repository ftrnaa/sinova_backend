import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import pool from "../config/db.js"; 

import {
  simpanOtp,
  ambilOtpTerbaru,
  tandaiOtpDigunakan,
  updatePasswordUser
} from "../models/lupa_sandiModel.js";


// ==============================
// 1. KIRIM OTP
// ==============================
export const kirimOtp = async (req, res) => {
  const { email } = req.body;

  try {
    // cek user
    const user = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (user.rows.length === 0)
      return res.status(404).json({ message: "Email tidak ditemukan" });

    // buat OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const kadaluwarsa = new Date(Date.now() + 15 * 60 * 1000); // 15 menit

    await simpanOtp(email, otp, kadaluwarsa);

    // kirim email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: { rejectUnauthorized: false }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "OTP Reset Kata Sandi",
      text: `Kode OTP Anda: ${otp} (berlaku 15 menit)`
    });

    res.json({ message: "OTP berhasil dikirim" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Gagal mengirim OTP" });
  }
};


// ==============================
// 2. VERIFIKASI OTP
// ==============================
export const verifikasiOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const data = await ambilOtpTerbaru(email, otp);

    if (data.rows.length === 0)
      return res.status(400).json({ message: "OTP salah" });

    const token = data.rows[0];

    if (token.digunakan)
      return res.status(400).json({ message: "OTP sudah digunakan" });

    if (new Date(token.kadaluwarsa_pada) < new Date())
      return res.status(400).json({ message: "OTP kadaluwarsa" });

    res.json({ message: "OTP valid" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Gagal verifikasi OTP" });
  }
};


// ==============================
// 3. RESET PASSWORD TANPA OTP LAGI
// ==============================
export const resetKataSandi = async (req, res) => {
  const { email, kataSandiBaru } = req.body;

  try {
    if (!email || !kataSandiBaru) {
      return res.status(400).json({ message: "Email dan kata sandi baru wajib diisi" });
    }

    const hashed = await bcrypt.hash(kataSandiBaru, 10);

    // update password user
    await updatePasswordUser(email, hashed);

    res.json({ message: "Kata sandi berhasil direset" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Gagal reset kata sandi" });
  }
};
