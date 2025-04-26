import express from 'express';
import { addHospital, getHospitals } from '../controllers/adminController.js';
import {protect,authorize} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/hospitals', protect,authorize('admin'), addHospital);

router.get('/hospitals', protect, authorize('admin'), getHospitals);

export default router;