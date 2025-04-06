// Structure des dossiers
/*
/models
  - User.js
  - Hospital.js
  - Ambulance.js
/controllers
  - authController.js
  - adminController.js
  - hospitalController.js
  - ambulanceController.js
/routes
  - authRoutes.js
  - adminRoutes.js
  - hospitalRoutes.js
  - ambulanceRoutes.js
  - patientRoutes.js (pas d'authentification requise)
/middlewares
  - authMiddleware.js
/config
  - db.js
  - passport.js
/utils
  - emailService.js
*/

// Modèle User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'hospital', 'ambulance'],
    required: true
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: function() {
      return this.role === 'hospital' || this.role === 'ambulance';
    }
  },
  ambulance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ambulance',
    required: function() {
      return this.role === 'ambulance';
    }
  },
  isFirstLogin: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password avant sauvegarde
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Méthode pour comparer les mots de passe
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Générer JWT token
UserSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { userId: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
};

module.exports = mongoose.model('User', UserSchema);

// Modèle Hospital.js
const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  address: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexer la localisation pour les recherches géospatiales
HospitalSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Hospital', HospitalSchema);

// Modèle Ambulance.js
const mongoose = require('mongoose');

const AmbulanceSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'busy', 'maintenance'],
    default: 'available'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexer la localisation pour les recherches géospatiales
AmbulanceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Ambulance', AmbulanceSchema);

// authController.js
const User = require('../models/User');
const Hospital = require('../models/Hospital');
const Ambulance = require('../models/Ambulance');
const emailService = require('../utils/emailService');
const crypto = require('crypto');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Vérifier que l'email et le mot de passe existent
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Veuillez fournir un email et un mot de passe' 
      });
    }
    
    // Trouver l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email ou mot de passe incorrect' 
      });
    }
    
    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email ou mot de passe incorrect' 
      });
    }
    
    // Générer le token JWT
    const token = user.generateAuthToken();
    
    // Retourner la réponse avec le token et les infos utilisateur
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isFirstLogin: user.isFirstLogin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur de serveur lors de la connexion' 
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Utilisateur non trouvé' 
      });
    }
    
    // Vérifier l'ancien mot de passe
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Mot de passe actuel incorrect' 
      });
    }
    
    // Mettre à jour le mot de passe
    user.password = newPassword;
    user.isFirstLogin = false;
    user.updatedAt = Date.now();
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Mot de passe mis à jour avec succès'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur de serveur lors du changement de mot de passe' 
    });
  }
};

// Middleware d'authentification - authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Vérifier la présence du token dans l'en-tête
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Accès non autorisé, token manquant' 
      });
    }
    
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Trouver l'utilisateur par ID
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Utilisateur non trouvé' 
      });
    }
    
    // Ajouter l'utilisateur à la requête
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Token invalide ou expiré' 
    });
  }
};

// Middleware pour vérifier les rôles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Accès non autorisé pour ce rôle' 
      });
    }
    next();
  };
};

// Service d'email - emailService.js
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Configuration du transporteur d'email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Fonction pour générer un mot de passe aléatoire
exports.generateRandomPassword = () => {
  return crypto.randomBytes(8).toString('hex');
};

// Fonction pour envoyer un email d'invitation à un hôpital
exports.sendHospitalInvitation = async (hospitalEmail, password) => {
  const mailOptions = {
    from: `"Service d'Urgence" <${process.env.EMAIL_FROM}>`,
    to: hospitalEmail,
    subject: "Invitation à rejoindre notre système d'urgence médicale",
    html: `
      <h1>Bienvenue au système d'urgence médicale</h1>
      <p>Votre établissement a été ajouté à notre plateforme de gestion des urgences médicales.</p>
      <p>Veuillez utiliser les identifiants suivants pour vous connecter:</p>
      <ul>
        <li><strong>Email:</strong> ${hospitalEmail}</li>
        <li><strong>Mot de passe temporaire:</strong> ${password}</li>
      </ul>
      <p>Vous serez invité à changer votre mot de passe lors de votre première connexion.</p>
      <p>Lien de connexion: <a href="${process.env.FRONTEND_URL}/login">Se connecter</a></p>
    `
  };
  
  return await transporter.sendMail(mailOptions);
};

// Fonction pour envoyer un email d'invitation à un ambulancier
exports.sendAmbulanceInvitation = async (ambulanceUserEmail, password, ambulanceNumber, hospitalName) => {
  const mailOptions = {
    from: `"Service d'Urgence" <${process.env.EMAIL_FROM}>`,
    to: ambulanceUserEmail,
    subject: "Vos identifiants pour le système d'urgence médicale",
    html: `
      <h1>Bienvenue au système d'urgence médicale</h1>
      <p>Vous avez été assigné(e) à l'ambulance ${ambulanceNumber} de l'hôpital ${hospitalName}.</p>
      <p>Veuillez utiliser les identifiants suivants pour vous connecter:</p>
      <ul>
        <li><strong>Email:</strong> ${ambulanceUserEmail}</li>
        <li><strong>Mot de passe temporaire:</strong> ${password}</li>
      </ul>
      <p>Vous serez invité à changer votre mot de passe lors de votre première connexion.</p>
      <p>Lien de connexion: <a href="${process.env.FRONTEND_URL}/login">Se connecter</a></p>
    `
  };
  
  return await transporter.sendMail(mailOptions);
};

// Contrôleur administrateur - adminController.js
const Hospital = require('../models/Hospital');
const User = require('../models/User');
const emailService = require('../utils/emailService');

// Ajouter un nouvel hôpital
exports.addHospital = async (req, res) => {
  try {
    const { name, email, address, location } = req.body;
    
    // Vérifier si l'hôpital existe déjà
    const existingHospital = await Hospital.findOne({ email });
    if (existingHospital) {
      return res.status(400).json({
        success: false,
        message: 'Un hôpital avec cet email existe déjà'
      });
    }
    
    // Créer le nouvel hôpital
    const hospital = new Hospital({
      name,
      email,
      address,
      location: {
        type: 'Point',
        coordinates: location
      }
    });
    
    await hospital.save();
    
    // Générer un mot de passe temporaire
    const tempPassword = emailService.generateRandomPassword();
    
    // Créer un compte utilisateur pour l'hôpital
    const hospitalUser = new User({
      email,
      password: tempPassword,
      role: 'hospital',
      hospital: hospital._id
    });
    
    await hospitalUser.save();
    
    // Envoyer l'email d'invitation à l'hôpital
    await emailService.sendHospitalInvitation(email, tempPassword);
    
    res.status(201).json({
      success: true,
      message: 'Hôpital ajouté avec succès',
      data: hospital
    });
  } catch (error) {
    console.error('Add hospital error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout de l\'hôpital'
    });
  }
};

// Contrôleur hôpital - hospitalController.js
const Ambulance = require('../models/Ambulance');
const User = require('../models/User');
const emailService = require('../utils/emailService');

// Ajouter une nouvelle ambulance
exports.addAmbulance = async (req, res) => {
  try {
    const { registrationNumber, email } = req.body;
    const hospitalId = req.user.hospital;
    
    // Vérifier si l'ambulance existe déjà
    const existingAmbulance = await Ambulance.findOne({ registrationNumber });
    if (existingAmbulance) {
      return res.status(400).json({
        success: false,
        message: 'Une ambulance avec ce numéro d\'immatriculation existe déjà'
      });
    }
    
    // Vérifier si l'email est déjà utilisé
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }
    
    // Créer la nouvelle ambulance
    const ambulance = new Ambulance({
      registrationNumber,
      hospital: hospitalId
    });
    
    await ambulance.save();
    
    // Générer un mot de passe temporaire
    const tempPassword = emailService.generateRandomPassword();
    
    // Créer un compte utilisateur pour l'ambulancier
    const ambulanceUser = new User({
      email,
      password: tempPassword,
      role: 'ambulance',
      hospital: hospitalId,
      ambulance: ambulance._id
    });
    
    await ambulanceUser.save();
    
    // Récupérer le nom de l'hôpital
    const hospital = await Hospital.findById(hospitalId);
    
    // Envoyer l'email d'invitation à l'ambulancier
    await emailService.sendAmbulanceInvitation(email, tempPassword, registrationNumber, hospital.name);
    
    res.status(201).json({
      success: true,
      message: 'Ambulance ajoutée avec succès',
      data: ambulance
    });
  } catch (error) {
    console.error('Add ambulance error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout de l\'ambulance'
    });
  }
};

// Routes d'authentification - authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// Routes publiques
router.post('/login', authController.login);

// Routes protégées
router.post('/change-password', protect, authController.changePassword);

module.exports = router;

// app.js - Configuration principale de l'application
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const ambulanceRoutes = require('./routes/ambulanceRoutes');
const patientRoutes = require('./routes/patientRoutes');
const { protect, authorize } = require('./middlewares/authMiddleware');

// Charger les variables d'environnement
dotenv.config();

// Connexion à la base de données
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', protect, authorize('admin'), adminRoutes);
app.use('/api/hospital', protect, authorize('hospital'), hospitalRoutes);
app.use('/api/ambulance', protect, authorize('ambulance'), ambulanceRoutes);
app.use('/api/patient', patientRoutes); // Pas d'authentification requise

// Route par défaut
app.get('/', (req, res) => {
  res.send('API du système d\'urgence médicale');
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Port et démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));