import express from 'express';
import { login, changePassword } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Routes publiques
router.post('/login', login);

// Routes protégées
router.post('/change-password', protect, changePassword);

export default router
