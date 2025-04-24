import express from 'express';
import { addHospital } from '../controllers/adminController.js';
import {protect,authorize} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/hospitals', protect,authorize('admin'), addHospital);

export default router;