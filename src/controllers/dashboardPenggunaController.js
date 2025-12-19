import {
  getTotalUsulan,
  getUsulanBaru,
  getHistory,
  getStatusData,
  getDataBulan,
} from "../models/dashboardPenggunaModel.js";

export const getDashboardPengguna = async (req, res) => {
  try {
    const totalUsulan = await getTotalUsulan();
    const usulanBaru = await getUsulanBaru();
    const history = await getHistory();
    const statusData = await getStatusData();
    const dataBulan = await getDataBulan();

    res.json({
      statistik: { totalUsulan, usulanBaru, history },
      statusData,
      dataBulan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal mengambil data dashboard" });
  }
};
