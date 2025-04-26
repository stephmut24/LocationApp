import api from '../config/axios';

const hospitalService = {
  addHospital: async (hospitalData) => {
    try {
      const response = await api.post('/admin/hospitals', hospitalData);
      console.log('Hôpital ajouté avec succès:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'hôpital:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'ajout de l\'hôpital');
    }
  },

  updateHospital: async (id, hospitalData) => {
    try {
      const response = await api.put(`/admin/hospitals/${id}`, hospitalData);
      console.log('Hôpital mis à jour:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  },

  getHospitals: async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const endpoint = user?.role === 'hospital' 
        ? '/hospital/ambulances'  
        : '/admin/hospitals';      // Pour l'admin
      console.log('Endpoint utilisé:', endpoint);
      const response = await api.get(endpoint);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération:', error);
      throw error;
    }
  
  },
  
  getHospital: async (id) => {
    try {
      const response = await api.get(`/admin/hospitals/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'hôpital ${id}:`, error);
      throw new Error('Impossible de récupérer les détails de l\'hôpital');
    }
  },

  deleteHospital: async (id) => {
    try {
      const response = await api.delete(`/hospitals/${id}`);
      console.log('Hôpital supprimé avec succès');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      throw new Error('Impossible de supprimer l\'hôpital');
    }
  }
};

export default hospitalService;