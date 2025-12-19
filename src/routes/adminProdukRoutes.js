import express from 'express';
import * as adminController from '../controllers/adminProdukController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', adminController.listProdukAdmin); // bisa filter ?status=
router.put('/:id/approve', adminController.approveProduk);
router.put('/:id/reject', adminController.rejectProduk);
router.delete('/:id', adminController.deleteProduk);

export default router;
