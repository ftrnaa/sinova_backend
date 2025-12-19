import { getRiwayatUsulanAdminModel } from "../models/adminRiwayatUsulanModel.js";

export const getRiwayatUsulanAdmin = async (req, res) => {
  try {
    const result = await getRiwayatUsulanAdminModel();

    res.status(200).json({
      success: true,
      total: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error riwayat usulan admin:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil riwayat usulan",
    });
  }
};
