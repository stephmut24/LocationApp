import Hospital from '../models/Hospital.js';
import User from '../models/User.js';
import * as emailService from '../utils/emailService.js';

// Ajouter un nouvel hôpital
export const addHospital = async (req, res) => {
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