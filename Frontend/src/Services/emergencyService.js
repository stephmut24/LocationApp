import api from '../config/axios';

export const emergencyService = {
  createEmergency: async (emergencyData) => {
    try {
      const response = await api.post('/emergencies/create', emergencyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la création de l\'urgence' };
    }
  }
};

export default emergencyService;