import express from 'express';

const router = express.Router();

// Routes pour les patients (sans authentification)
router.post('/emergency', (req, res) => {
  // Traitement des demandes d'urgence
});
export default router