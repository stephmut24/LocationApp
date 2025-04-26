import Ambulance from '../models/Ambulance.js';
import User from '../models/User.js';
import Hospital from '../models/Hospital.js';
import * as emailService from '../utils/emailService.js';

export const addAmbulance = async (req, res) => {
  try {
    const { 
      registrationNumber, 
      driverEmail, 
      driverPhone,
      location 
    } = req.body;
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
    const existingUser = await User.findOne({ email: driverEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }
    
    // Créer la nouvelle ambulance
    const ambulance = new Ambulance({
      registrationNumber,
      hospital: hospitalId,
      driverEmail,
      driverPhone,
      location: {
        type: 'Point',
        coordinates: location || [0, 0]
      },
      status: 'available'
    });
    
    await ambulance.save();
    
    // Générer un mot de passe temporaire
    const tempPassword = emailService.generateRandomPassword();
    
    // Créer un compte utilisateur pour l'ambulancier
    const ambulanceUser = new User({
      email: driverEmail,
      password: tempPassword,
      role: 'ambulance',
      hospital: hospitalId,
      ambulance: ambulance._id
    });
    
    await ambulanceUser.save();
    
    // Récupérer le nom de l'hôpital
    const hospital = await Hospital.findById(hospitalId);
    
    // Envoyer l'email d'invitation à l'ambulancier
    await emailService.sendAmbulanceInvitation(
      driverEmail, 
      tempPassword, 
      registrationNumber, 
      hospital.name
    );
    
    res.status(201).json({
      success: true,
      message: 'Ambulance ajoutée avec succès et invitation envoyée à l\'ambulancier',
      data: ambulance
    });
  } catch (error) {
    console.error('Add ambulance error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout de l\'ambulance',
      error: error.message
    });
  }
};

export const getAmbulances = async (req, res) => {
  try {
    const hospitalId = req.user.hospital;
    const ambulances = await Ambulance.find({ hospital: hospitalId })
      .populate('hospital', 'name');

    res.status(200).json({
      success: true,
      count: ambulances.length,
      data: ambulances
    });
  } catch (error) {
    console.error('Get ambulances error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des ambulances',
      error: error.message
    });
  }
};

export const getAmbulance = async (req, res) => {
  try {
    const hospitalId = req.user.hospital;
    const ambulance = await Ambulance.findOne({
      _id: req.params.id,
      hospital: hospitalId
    }).populate('hospital', 'name');

    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      data: ambulance
    });
  } catch (error) {
    console.error('Get ambulance error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'ambulance',
      error: error.message
    });
  }
};

export const updateAmbulance = async (req, res) => {
  try {
    const hospitalId = req.user.hospital;
    const { registrationNumber, driverEmail, driverPhone, location } = req.body;

    const ambulance = await Ambulance.findOne({
      _id: req.params.id,
      hospital: hospitalId
    });

    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance non trouvée'
      });
    }

    // Vérifier si le nouveau numéro d'immatriculation existe déjà
    if (registrationNumber !== ambulance.registrationNumber) {
      const existingAmbulance = await Ambulance.findOne({ registrationNumber });
      if (existingAmbulance) {
        return res.status(400).json({
          success: false,
          message: 'Ce numéro d\'immatriculation est déjà utilisé'
        });
      }
    }

    // Mise à jour de l'ambulance
    ambulance.registrationNumber = registrationNumber;
    ambulance.driverEmail = driverEmail;
    ambulance.driverPhone = driverPhone;
    if (location) {
      ambulance.location = {
        type: 'Point',
        coordinates: location
      };
    }

    await ambulance.save();

    res.status(200).json({
      success: true,
      message: 'Ambulance mise à jour avec succès',
      data: ambulance
    });
  } catch (error) {
    console.error('Update ambulance error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'ambulance',
      error: error.message
    });
  }
};

export const deleteAmbulance = async (req, res) => {
  try {
    const hospitalId = req.user.hospital;
    const ambulance = await Ambulance.findOne({
      _id: req.params.id,
      hospital: hospitalId
    });

    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance non trouvée'
      });
    }

    // Supprimer l'utilisateur ambulancier associé
    await User.deleteOne({ 
      email: ambulance.driverEmail,
      role: 'ambulance'
    });

    // Supprimer l'ambulance
    await ambulance.remove();

    res.status(200).json({
      success: true,
      message: 'Ambulance et compte ambulancier supprimés avec succès'
    });
  } catch (error) {
    console.error('Delete ambulance error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'ambulance',
      error: error.message
    });
  }
};

// Ajouter les autres méthodes CRUD si nécessaires...