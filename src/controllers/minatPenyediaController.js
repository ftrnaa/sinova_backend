import {
  createMinatPenyedia,
  getMinatByKebutuhan,
  approveMinat
} from "../models/minatPenyediaModel.js";

/* ===============================
   AJUKAN PROPOSAL (PENYEDIA)
================================ */
export const ajukanProposal = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File proposal wajib diupload (PDF / Word)"
      });
    }

    const data = {
      kebutuhan_id: Number(req.body.kebutuhan_id),
      penyedia_id: req.user.id,
      proposal_file: req.file.filename,
      deskripsi: req.body.deskripsi,
      estimasi_biaya: req.body.estimasi_biaya || null,
      estimasi_waktu: req.body.estimasi_waktu || null
    };

    const result = await createMinatPenyedia(data);

    res.status(201).json({
      success: true,
      message: "Proposal berhasil diajukan",
      data: result
    });
  } catch (err) {
    console.error("ERROR AJUKAN PROPOSAL:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/* ===============================
   GET PEMINAT BY KEBUTUHAN
================================ */
export const getPeminatByKebutuhan = async (req, res) => {
  try {
    const kebutuhanId = Number(req.params.kebutuhanId);
    const data = await getMinatByKebutuhan(kebutuhanId);

    res.json({
      success: true,
      total: data.length,
      data
    });
  } catch (err) {
    console.error("ERROR GET PEMINAT:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/* ===============================
   APPROVE PENYEDIA
================================ */
export const approvePenyedia = async (req, res) => {
  try {
    const minatId = Number(req.params.id);
    await approveMinat(minatId);

    res.json({
      success: true,
      message: "Penyedia berhasil dipilih"
    });
  } catch (err) {
    console.error("ERROR APPROVE:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
