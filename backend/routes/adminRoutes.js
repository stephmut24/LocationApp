import express from 'express';
import { addHospital } from '../controllers/adminController.js';

const router = express.Router();

router.post('/hospitals', addHospital);


export default router;