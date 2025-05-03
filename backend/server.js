import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';
import { initSocket } from './utils/socket.js';
// Charger les variables d'environnement
dotenv.config();

// Connexion à la base de données
connectDB();
const { server, io } = initSocket(app);

// 3) Rendre `io` disponible dans les contrôleurs si besoin
// Par exemple, vous pouvez faire :
app.set('io', io);

// Port et démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));