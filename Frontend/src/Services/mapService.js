import axios from 'axios';
import { MAPBOX_TOKEN } from "../utils/mapboxConfig";

class MapService {
  constructor() {
    this.mapboxUrl = 'https://api.mapbox.com/directions/v5/mapbox/driving'; // API pour la conduite
  }

  /**
   * Calcule le chemin le plus court entre deux points (ambulance et urgence)
   */
  async calculateRoute(start, end) {
    try {
      // Utiliser MAPBOX_TOKEN importé
      const routeQuery = `${this.mapboxUrl}/${start};${end}?access_token=${MAPBOX_TOKEN}&geometries=geojson&overview=full`;

      // Effectuer la requête à Mapbox Directions API
      const response = await axios.get(routeQuery);

      if (response.data.routes && response.data.routes.length > 0) {
        const route = response.data.routes[0]; // On prend la première route

        const distance = route.distance; // Distance totale en mètres
        const duration = route.duration; // Durée totale en secondes
        const geometry = route.geometry; // Géométrie de la route (coordonnées pour dessiner sur la carte)

        return {
          distance,
          duration,
          geometry
        };
      } else {
        throw new Error('Aucune route trouvée');
      }
    } catch (error) {
      console.error('Erreur de calcul de l\'itinéraire:', error);
      throw error;
    }
  }
}

export default MapService;
