import Emergency from '../models/Emergency.js';
import Neo4jService from '../services/neo4jService.js';

const neo4jService = new Neo4jService();
await neo4jService.init();

export const createEmergency = async (req, res) => {
  try {
    console.log('=== Nouvelle urgence ===');
    console.log('Location reçue:', JSON.stringify(req.body.location, null, 2));
    console.log('Numéro de téléphone:', req.body.phoneNumber);

    const { location, phoneNumber } = req.body;

    if (!location || location.latitude === undefined || location.longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Les coordonnées latitude et longitude sont requises"
      });
    }

    const geoLocation = {
      type: "Point",
      coordinates: [location.longitude, location.latitude]
    };

    const emergency = new Emergency({
      location: geoLocation,
      phoneNumber,
      status: 'pending'
    });

    console.log('Sauvegarde dans MongoDB...');
    const savedEmergency = await emergency.save();
    console.log('Emergency sauvegardée dans MongoDB:', savedEmergency._id);

    console.log('Création du nœud dans Neo4j...');
    const neo4jResult = await neo4jService.createEmergencyNodeAndCalculateDistances(savedEmergency);

    res.status(201).json({
      success: true,
      data: {
        emergency: savedEmergency,
        nearbyHospitals: neo4jResult.nearbyHospitals
      },
      message: "Urgence créée avec succès"
    });

  } catch (error) {
    console.error('Erreur création urgence:', error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de l'urgence",
      error: error.message
    });
  }
};

  
export const getEmergencies = async (req, res) => {
  try {
    const emergencies = await Emergency.find()
      .sort({ createdAt: -1 })
      .populate('assignedAmbulance', 'name');

    res.json({
      success: true,
      data: emergencies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des urgences",
      error: error.message
    });
  }
};

export const updateEmergencyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const emergency = await Emergency.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: "Urgence non trouvée"
      });
    }

    res.json({
      success: true,
      data: emergency,
      message: "Statut mis à jour avec succès"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du statut",
      error: error.message
    });
  }
};