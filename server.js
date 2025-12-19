import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import penggunaRoutes from "./src/routes/penggunaRoutes.js";
import penyediaRoutes from "./src/routes/penyediaRoutes.js";
import pool, { connectDB } from "./src/config/db.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import kebutuhanRoutes from "./src/routes/kebutuhanRoutes.js";
import kategoriRoutes from "./src/routes/kategoriRoutes.js";
import risetRoutes from "./src/routes/RisetRoutes.js";
import beritaRoutes from "./src/routes/beritaRoutes.js";
import lupaKataSandiRoutes from "./src/routes/lupaKataSandiRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import minatPenyediaRoutes from "./src/routes/minatPenyediaRoutes.js";
import produkPenyediaRoutes from './src/routes/produkpenyediaRoutes.js';
import adminProdukRoutes from './src/routes/adminProdukRoutes.js';
import publicProdukRoutes from './src/routes/publicProdukRoutes.js';
import berandaRoutes from "./src/routes/berandaRoutes.js";
import dashboardAdminRoutes from "./src/routes/dashboardAdminRoutes.js";
import dashboardPenggunaRoutes from "./src/routes/dashboardPenggunaRoutes.js";

import adminRiwayatUsulanRoutes from "./src/routes/adminRiwayatUsulanRoutes.js";
import dashboardpenyediaRoutes from "./src/routes/dashboardpenyediaRoutes.js";
dotenv.config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
// Connect DB
connectDB();

// ==============================
// API ROUTES
// ==============================

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Sinova Backend API is running",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// Auth routes
app.use("/auth/pengguna", penggunaRoutes);
app.use("/auth/penyedia", penyediaRoutes);
app.use("/auth/admin", adminRoutes);
app.use("/auth", authRoutes);

// Feature routes
app.use("/api/kebutuhan", kebutuhanRoutes);
app.use("/api/kategori", kategoriRoutes);
app.use("/api/minat-penyedia", minatPenyediaRoutes);
app.use("/api/berita", beritaRoutes);
app.use("/api/lupasandi", lupaKataSandiRoutes);
app.use("/api/riset", risetRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/beranda", berandaRoutes);
app.use("/api/dashboard", dashboardAdminRoutes);
app.use("/api", dashboardPenggunaRoutes);

app.use("/api", dashboardpenyediaRoutes);
app.use("/api/admin", adminRiwayatUsulanRoutes);


// Produk Routes
app.use("/api/produk", produkPenyediaRoutes);         
app.use("/api/admin/produk", adminProdukRoutes);      
app.use("/api/public/produk", publicProdukRoutes);    

// Static uploads
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==============================
// START SERVER (HANYA SEKALI)
// ==============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT} 🚀`);
});
