
import cors from 'cors';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import hospitalRoutes from './routes/hospitalRoutes.js';
import ambulanceRoutes from './routes/ambulanceRoutes.js';
import emergencyRoutes from './routes/emergencyRoutes.js';
import { protect, authorize } from './middlewares/authMiddleware.js';
import './initAdmin.js';


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin',   adminRoutes);
app.use('/api/hospital',protect, authorize('hospital'),  hospitalRoutes);
app.use('/api/ambulance', protect, authorize('ambulance'), ambulanceRoutes);
app.use('/api/emergencies', emergencyRoutes);
// Route par défaut
app.get('/', (req, res) => {
  res.send('API du système d\'urgence médicale');
});

// Gestion des erreurs 404
app.use((req, res,next) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
    url: req.originalUrl
  });
});

export default app;
