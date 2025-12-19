import db from "../config/db.js";

export const getMyProfile = async (req, res) => {
  try {
    const user = await db.query(
      `SELECT id, name, email, no_handphone, foto_profil, role_id 
       FROM users 
       WHERE id = $1`,
      [req.user.id]
    );

    res.json(user.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data profil" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, no_handphone } = req.body;

    let fotoPath = null;
    if (req.file) {
      fotoPath = "uploads/profile/" + req.file.filename; // ✔ folder benar
    }

    const result = await db.query(
      `
      UPDATE users
      SET 
        name = $1,
        no_handphone = $2,
        foto_profil = COALESCE($3, foto_profil)   -- ✔ kolom benar
      WHERE id = $4
      RETURNING id, name, email, no_handphone, foto_profil, role_id
      `,
      [name, no_handphone, fotoPath, userId]
    );

    res.json({
      message: "Profil berhasil diperbarui",
      user: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal update profil" });
  }
};
