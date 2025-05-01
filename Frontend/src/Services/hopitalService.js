import api from '../config/axios';

const hospitalService = {
  addHospital: async (hospitalData) => {
    try {
      // Validation des champs spécifiques aux hôpitaux
      if (!hospitalData.name || !hospitalData.email || !hospitalData.phone || !hospitalData.address) {
        throw new Error('Le nom, l\'email, le téléphone et l\'adresse sont requis');
      }

      // Formatage des données spécifiques aux hôpitaux
      const formattedData = {
        name: hospitalData.name,
        email: hospitalData.email,
        phone: hospitalData.phone,
        address: hospitalData.address,
        location: {
          type: 'Point',
          coordinates: Array.isArray(hospitalData.location) 
            ? hospitalData.location 
            : hospitalData.location?.coordinates || [0, 0]
        }
      };

      console.log('Données hôpital à envoyer:', formattedData);
      const response = await api.post('/admin/hospitals', formattedData);
      
      return {
        success: true,
        data: response.data,
        message: 'Hôpital ajouté avec succès'
      };
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
      console.log('Récupération des hôpitaux...');
      const response = await api.get('/admin/hospitals');
      
      const formattedHospitals = response.data.data
        .filter(hospital => hospital && hospital.location)
        .map(hospital => {
          // Format standard de coordonnées pour Mapbox
          const coordinates = hospital.location.coordinates || hospital.location;
          
          if (!Array.isArray(coordinates)) {
            console.warn(`Format de coordonnées invalide pour ${hospital.name}:`, coordinates);
            return null;
          }

          return {
            ...hospital,
            location: {
              type: 'Point',
              coordinates: [
                parseFloat(coordinates[0]), // longitude
                parseFloat(coordinates[1])  // latitude
              ]
            }
          };
        })
        .filter(hospital => hospital !== null);

      console.log('Hôpitaux formatés:', formattedHospitals);

      return {
        success: true,
        data: formattedHospitals
      };
    } catch (error) {
      console.error('Erreur récupération hôpitaux:', error);
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