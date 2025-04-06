import Ambulance from '../models/Ambulance.js';
import User from '../models/User.js';
import Hospital from '../models/Hospital.js';
import * as emailService from '../utils/emailService.js';

// Ajouter une nouvelle ambulance
export const addAmbulance = async (req, res) => {
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
