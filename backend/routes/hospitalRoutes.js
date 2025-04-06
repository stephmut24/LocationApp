import express from 'express';
import { addAmbulance } from '../controllers/hospitalController.js';

const router = express.Router();

router.post('/ambulances', addAmbulance);

export default router;