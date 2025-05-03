import api from '../config/axios';

export const emergencyService = {
  createEmergency: async (emergencyData) => {
    try {
      const response = await api.post('/emergencies/create', emergencyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la création de l\'urgence' };
    }
  },
  
  getEmergencies: async () => {
    try {
      const response = await api.get('/emergencies');
      return response.data; // Assurez-vous que le backend renvoie un tableau de données
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des urgences' };
    }
  }
  
};


export default emergencyService;