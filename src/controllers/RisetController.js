import RisetModel from "../models/RisetModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class RisetController {

  // GET ALL
  static async getAll(req, res) {
    try {
      const {
        judul = "",
        namaPeriset = "",
        kategori = "",
        page = 1,
        limit = 10,
      } = req.query;

      console.log("📥 GET Request:", { judul, namaPeriset, kategori, page, limit });

      const result = await RisetModel.getAll({
        judul,
        namaPeriset,
        kategori,
        page: parseInt(page),
        limit: parseInt(limit),
      });

      console.log("✅ Data fetched:", result.data.length, "records");

      res.status(200).json({
        success: true,
        message: "Data riset berhasil diambil",
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error("❌ Error in getAll:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat mengambil data riset",
        error: error.message,
      });
    }
  }

  // GET BY ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      console.log("📥 GET BY ID:", id);

      const riset = await RisetModel.getById(id);

      if (!riset) {
        console.log("⚠️ Data not found for ID:", id);
        return res.status(404).json({
          success: false,
          message: "Data riset tidak ditemukan",
        });
      }

      console.log("✅ Data found:", riset.judul);

      res.status(200).json({
        success: true,
        message: "Detail riset berhasil diambil",
        data: riset,
      });
    } catch (error) {
      console.error("❌ Error in getById:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat mengambil detail riset",
        error: error.message,
      });
    }
  }

  // CREATE
  static async create(req, res) {
    try {
      const { judul, namaPeriset, kategoriRiset } = req.body;
      const dokumentUrl = req.file ? req.file.filename : null;

      console.log("📥 CREATE Request:", { judul, namaPeriset, kategoriRiset, dokumentUrl });

      if (!judul || !namaPeriset || !kategoriRiset) {
        console.log("⚠️ Validation failed");
        
        if (req.file) {
          const filePath = path.join(__dirname, "../../uploads", req.file.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log("🗑️ File deleted");
          }
        }

        return res.status(400).json({
          success: false,
          message: "Judul, nama periset, dan kategori riset wajib diisi!",
        });
      }

      const newRiset = await RisetModel.create({
        judul,
        namaPeriset,
        kategoriRiset,
        dokumentUrl
      });

      console.log("✅ Data created:", newRiset.id);

      res.status(201).json({
        success: true,
        message: "Data riset berhasil ditambahkan",
        data: newRiset,
      });

    } catch (error) {
      console.error("❌ Create Error:", error);

      if (req.file) {
        const filePath = path.join(__dirname, "../../uploads", req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      res.status(500).json({ 
        success: false, 
        message: error.message || "Terjadi kesalahan saat menambahkan data"
      });
    }
  }

  // UPDATE
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { judul, namaPeriset, kategoriRiset } = req.body;

      console.log("📥 UPDATE Request:", { id, judul, namaPeriset, kategoriRiset });

      if (!judul || !namaPeriset || !kategoriRiset) {
        console.log("⚠️ Validation failed");

        if (req.file) {
          const filePath = path.join(__dirname, "../../uploads", req.file.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }

        return res.status(400).json({
          success: false,
          message: "Judul, nama periset, dan kategori riset wajib diisi!",
        });
      }

      const existingRiset = await RisetModel.getById(id);
      if (!existingRiset) {
        console.log("⚠️ Data not found");

        if (req.file) {
          const filePath = path.join(__dirname, "../../uploads", req.file.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }

        return res.status(404).json({
          success: false,
          message: "Data riset tidak ditemukan",
        });
      }

      let dokumentUrl = existingRiset.dokumen_url;
      
      if (req.file) {
        dokumentUrl = req.file.filename;
        console.log("📎 New file:", dokumentUrl);
        
        if (existingRiset.dokumen_url) {
          const oldFilePath = path.join(__dirname, "../../uploads", existingRiset.dokumen_url);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
            console.log("🗑️ Old file deleted");
          }
        }
      }

      const updatedRiset = await RisetModel.update(id, {
        judul,
        namaPeriset,
        kategoriRiset,
        dokumentUrl,
      });

      console.log("✅ Data updated:", updatedRiset.id);

      res.status(200).json({
        success: true,
        message: "Data riset berhasil diperbarui",
        data: updatedRiset,
      });
    } catch (error) {
      console.error("❌ Error in update:", error);

      if (req.file) {
        const filePath = path.join(__dirname, "../../uploads", req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat memperbarui data riset",
        error: error.message,
      });
    }
  }

  // DELETE
  static async delete(req, res) {
    try {
      const { id } = req.params;
      console.log("📥 DELETE Request:", id);

      const existingRiset = await RisetModel.getById(id);
      
      if (!existingRiset) {
        console.log("⚠️ Data not found");
        return res.status(404).json({
          success: false,
          message: "Data riset tidak ditemukan",
        });
      }

      if (existingRiset.dokumen_url) {
        const filePath = path.join(__dirname, "../../uploads", existingRiset.dokumen_url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log("🗑️ File deleted");
        }
      }

      const deleted = await RisetModel.delete(id);
      
      if (!deleted) {
        return res.status(500).json({
          success: false,
          message: "Gagal menghapus data dari database",
        });
      }

      console.log("✅ Data deleted:", id);

      res.status(200).json({
        success: true,
        message: "Data riset berhasil dihapus",
      });
    } catch (error) {
      console.error("❌ Error in delete:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat menghapus data riset",
        error: error.message,
      });
    }
  }
}

export default RisetController;