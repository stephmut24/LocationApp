import express from 'express';
import { 
    addAmbulance,
    getAmbulances,
    getAmbulance,
    updateAmbulance
} from '../controllers/hospitalController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Routes pour la gestion des ambulances avec autorisation uniquement pour l'hôpital
router.post('/ambulances',  addAmbulance);
router.get('/ambulances',  getAmbulances);
router.get('/ambulances/:id',  getAmbulance);
router.put('/ambulances/:id', updateAmbulance);

export default router;