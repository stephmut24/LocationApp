import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

// Charger les variables d'environnement
dotenv.config();

// Connexion à la base de données
connectDB();

// Port et démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));