import pool from "../config/db.js";

// ===============================
// SIMPAN OTP BARU
// ===============================
export const simpanOtp = async (email, otp, kadaluwarsa) => {
  return pool.query(
    `INSERT INTO token_reset_kata_sandi (email, otp, kadaluwarsa_pada)
     VALUES ($1, $2, $3)`,
    [email, otp, kadaluwarsa]
  );
};

// ===============================
// AMBIL OTP TERBARU UNTUK EMAIL
// ===============================
export const ambilOtpTerbaru = async (email, otp) => {
  return pool.query(
    `SELECT * FROM token_reset_kata_sandi
     WHERE email=$1 AND otp=$2
     ORDER BY dibuat_pada DESC LIMIT 1`,
    [email, otp]
  );
};

// ===============================
// TANDAI OTP SEBAGAI DIGUNAKAN
// ===============================
export const tandaiOtpDigunakan = async (idToken) => {
  return pool.query(
    `UPDATE token_reset_kata_sandi SET digunakan = TRUE WHERE id = $1`,
    [idToken]
  );
};

// ===============================
// UPDATE PASSWORD USER
// ===============================
export const updatePasswordUser = async (email, hashedPassword) => {
  return pool.query(
    `UPDATE users SET password = $1 WHERE email = $2`,
    [hashedPassword, email]
  );
};
