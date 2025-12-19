import {
  getStatistikProdukPenyedia,
  getProdukPenyedia,
} from "../models/dashboardpenyediaModel.js";

export const getDashboardPenyedia = async (req, res) => {
  try {
    const userId = req.user.id; // dari JWT

    const statistik = await getStatistikProdukPenyedia(userId);
    const produk = await getProdukPenyedia(userId);

    res.status(200).json({
      success: true,
      data: {
        statistik,
        produk,
      },
    });
  } catch (error) {
    console.error("Dashboard Penyedia Error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data dashboard penyedia",
    });
  }
};
