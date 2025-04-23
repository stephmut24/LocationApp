import express from 'express';
import { login, changePassword } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Routes publiques
router.post('/login', login);

// Routes protégées
router.post('/change-password', protect, changePassword);



// Route de test pour vérifier l'authentification
router.get('/me', protect, (req, res) => {
  res.json({ 
    status: 'success',
    data: {
      user: req.user
    }
  });
});

export default router
