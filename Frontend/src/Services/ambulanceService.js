import api from '../config/axios';

const ambulanceService = {
  addAmbulance: async (ambulanceData) => {
    try {
      const response = await api.post('/hospital/ambulances', ambulanceData);
      console.log('Ambulance ajoutée avec succès:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'ambulance:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'ajout de l\'ambulance');
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
      const response = await api.get('/hospital/ambulances'); // Utiliser le bon endpoint
      console.log('Liste des ambulances reçue:', response.data);
      
      // Formater les données pour la carte
      const formattedData = {
        data: response.data.map(ambulance => ({
          ...ambulance,
          // S'assurer que location est dans le bon format pour Mapbox
          location: {
            coordinates: ambulance.location.coordinates || [0, 0],
            type: 'Point'
          }
        }))
      };

      console.log('Données formatées pour la carte:', formattedData);
      return formattedData;
    } catch (error) {
      console.error('Erreur lors de la récupération des ambulances:', error);
      throw new Error('Impossible de récupérer la liste des ambulances');
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