import express from 'express';
import * as publicController from '../controllers/publicProdukController.js';
const router = express.Router();

// Bisa diakses publik, tidak pakai auth
router.get('/katalog', publicController.katalog);

export default router;
