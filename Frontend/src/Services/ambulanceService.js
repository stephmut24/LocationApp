import api from '../config/axios';

const ambulanceService = {
  addAmbulance : async (ambulanceData) => {
    try {
      // Validation des données
      if (!ambulanceData.registrationNumber || !ambulanceData.driverEmail) {
        throw new Error('Les champs requis sont manquants');
      }
  
      // Normalisation des coordonnées
      const coordinates = Array.isArray(ambulanceData.location)
        ? ambulanceData.location
        : ambulanceData.location?.coordinates || [29.2356, -1.6835];
  
      // Formatage des données pour l'API
      const payload = {
        registrationNumber: ambulanceData.registrationNumber,
        driverEmail: ambulanceData.driverEmail,
        driverPhone: ambulanceData.driverPhone || '',
        location: {
          type: 'Point',
          coordinates: [
            parseFloat(coordinates[0]), // longitude
            parseFloat(coordinates[1])  // latitude
          ]
        },
        status: 'available'
      };
  
      console.log('Envoi au serveur:', payload);
  
      const response = await api.post('/hospital/ambulances', payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      }
      throw new Error(response.data?.message || 'Erreur serveur');
    } catch (error) {
      console.error('Erreur détaillée:', {
        message: error.message,
        response: error.response?.data,
        config: error.config
      });
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'ajout');
    }
  },


  updateAmbulance: async (id, ambulanceData) => {
    try {
      const response = await api.put(`/hospitals/ambulances/${id}`, ambulanceData);
      console.log('Ambulance mise à jour:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  },

  getAmbulances: async () => {
    try {
      const response = await api.get('/hospital/ambulances');
      console.log('Liste des ambulances reçue:', response.data);
      
      const formattedAmbulances = response.data
        .filter(ambulance => ambulance && ambulance.location)
        .map(ambulance => ({
          ...ambulance,
          location: {
            type: 'Point',
            coordinates: Array.isArray(ambulance.location?.coordinates) 
              ? ambulance.location.coordinates 
              : Array.isArray(ambulance.location) 
                ? ambulance.location 
                : [0, 0]
          }
        }));

      console.log('Ambulances formatées:', formattedAmbulances);
      
      return {
        success: true,
        data: formattedAmbulances
      };
    } catch (error) {
      console.error('Erreur récupération ambulances:', error);
      throw error;
    }
  },

  
  getAmbulance: async (id) => {
    try {
      const response = await api.get(`/admin/ambulances/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'ambulance ${id}:`, error);
      throw new Error('Impossible de récupérer les détails de l\'ambulance');
    }
  },

  deleteAmbulance: async (id) => {
    try {
      const response = await api.delete(`/admin/ambulances/${id}`);
      console.log('Ambulance supprimée avec succès');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      throw new Error('Impossible de supprimer l\'ambulance');
    }
  }
};

export default ambulanceService;