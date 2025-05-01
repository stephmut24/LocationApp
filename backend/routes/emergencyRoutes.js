import express from 'express';
import { createEmergency, getEmergencies, updateEmergencyStatus } from '../controllers/emergencyController.js';
import { protect, allowPublicEmergency } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route publique pour créer une urgence
router.post('/create', allowPublicEmergency, createEmergency);

// Routes protégées nécessitant une authentification
router.get('/', protect, getEmergencies);
router.patch('/:id/status', protect, updateEmergencyStatus);

export default router;