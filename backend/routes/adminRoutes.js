import express from 'express';
import Hospital from '../models/Hospital.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

// Test d'import du module email
import * as emailUtils from '../utils/email.js';  // Modification ici
console.log('Email utils importés:', emailUtils);  // Vérification des exports

const router = express.Router();

// Ajouter un hôpital
router.post('/hospitals', async (req, res) => {
  try {
    const { name, email, phone, address, location } = req.body;

    // Créer l'hôpital
    const newHospital = new Hospital({ name, email, phone, address, location });
    await newHospital.save();

    // Générer un mot de passe aléatoire
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer le gestionnaire de l'hôpital
    const newUser = new User({
      email,
      password: hashedPassword,
      role: 'hospitalManager',
      hospitalId: newHospital._id
    });
    await newUser.save();

    // Envoyer un e-mail au gestionnaire (modification ici)
    const subject = 'Bienvenue sur la plateforme d\'urgence';
    const text = `Vous avez été ajouté en tant que gestionnaire de l'hôpital ${name}. Voici vos informations de connexion :
Email: ${email}
Mot de passe: ${password}

Veuillez changer votre mot de passe après votre première connexion.`;

    console.log('Tentative d\'envoi d\'email à:', email);  // Log de vérification
    await emailUtils.sendEmail(email, subject, text);  // Modification ici

    res.status(201).json(newHospital);
  } catch (error) {
    console.error('Erreur complète:', error);  // Log plus détaillé
    res.status(500).json({ 
      message: 'Erreur lors de la création de l\'hôpital',
      error: error.message  // Renvoie seulement le message d'erreur
    });
  }
});

export { router as default };