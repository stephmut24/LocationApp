import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 20000
});

// Intercepteur pour les requêtes
api.interceptors.request.use(
  (config) => {
    // Log des données envoyées
    console.log('Données envoyées:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers
    });

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Erreur de requête:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response) => {
    console.log('Réponse reçue:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Erreur API:', {
      url: error.config?.url,
      data: error.config?.data,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });

    if (error.response) {
      switch (error.response.status) {
        case 400:
          // Erreur de validation
          throw new Error(error.response.data.message || 'Données invalides');
        case 401:
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Accès refusé');
          break;
        case 500:
          console.error('Erreur serveur');
          break;
        default:
          console.error('Erreur:', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

export default api;