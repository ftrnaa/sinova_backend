import RisetModel from "../models/RisetModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class RisetController {

  // ===============================
  // GET RISET MILIK USER LOGIN
  // ===============================
  static async getMy(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const userId = req.user.id;
      const data = await RisetModel.getByUserId(userId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("❌ Error in getMy:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan",
      });
    }
  }

  // ===============================
  // GET ALL RISET
  // ===============================
  static async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const result = await RisetModel.getAll({
        page: Number(page),
        limit: Number(limit),
      });

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error("❌ Error in getAll:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat mengambil data riset",
      });
    }
  }

  // ===============================
  // GET RISET BY ID
  // ===============================
  static async getById(req, res) {
    try {
      const { id } = req.params;

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "ID harus berupa angka",
        });
      }

      const riset = await RisetModel.getById(Number(id));

      if (!riset) {
        return res.status(404).json({
          success: false,
          message: "Data riset tidak ditemukan",
        });
      }

      res.status(200).json({
        success: true,
        data: riset,
      });
    } catch (error) {
      console.error("❌ Error in getById:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan",
      });
    }
  }

  // ===============================
  // CREATE RISET
  // ===============================
  static async create(req, res) {
    try {
      const { judul, namaPeriset, kategoriId } = req.body;
      const dokumenUrl = req.file ? req.file.filename : null;

      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!judul || !namaPeriset || !kategoriId) {
        // hapus file kalau gagal validasi
        if (req.file) {
          const filePath = path.join(__dirname, "../../uploads", req.file.filename);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        return res.status(400).json({
          success: false,
          message: "Judul, nama periset, dan kategori wajib diisi",
        });
      }

      const newRiset = await RisetModel.create({
        judul,
        namaPeriset,
        kategoriId,
        dokumenUrl,
        userId: req.user.id,
      });

      res.status(201).json({
        success: true,
        data: newRiset,
      });
    } catch (error) {
      console.error("❌ Error in create:", error);

      if (req.file) {
        const filePath = path.join(__dirname, "../../uploads", req.file.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }

      res.status(500).json({
        success: false,
        message: "Gagal menambahkan data riset",
      });
    }
  }

  // ===============================
  // UPDATE RISET
  // ===============================
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { judul, namaPeriset, kategoriId } = req.body;
      const dokumenUrl = req.file ? req.file.filename : null;

      const existing = await RisetModel.getById(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Data tidak ditemukan",
        });
      }

      // hapus file lama kalau upload baru
      if (req.file && existing.dokumen_url) {
        const oldPath = path.join(__dirname, "../../uploads", existing.dokumen_url);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      const updated = await RisetModel.update(id, {
        judul,
        namaPeriset,
        kategoriId,
        dokumenUrl,
      });

      res.status(200).json({
        success: true,
        data: updated,
      });
    } catch (error) {
      console.error("❌ Error in update:", error);

      if (req.file) {
        const filePath = path.join(__dirname, "../../uploads", req.file.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }

      res.status(500).json({
        success: false,
        message: "Gagal memperbarui data riset",
      });
    }
  }

  // ===============================
  // DELETE RISET
  // ===============================
  static async delete(req, res) {
    try {
      const { id } = req.params;

      const existing = await RisetModel.getById(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Data tidak ditemukan",
        });
      }

      if (existing.dokumen_url) {
        const filePath = path.join(__dirname, "../../uploads", existing.dokumen_url);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }

      await RisetModel.delete(id);

      res.status(200).json({
        success: true,
        message: "Data riset berhasil dihapus",
      });
    } catch (error) {
      console.error("❌ Error in delete:", error);
      res.status(500).json({
        success: false,
        message: "Gagal menghapus data riset",
      });
    }
  }
}

export default RisetController;
