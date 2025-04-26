import api from '../config/axios';

export const authService = {
  // Connexion utilisateur
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user, success } = response.data;

      if (!success || !token || !user) {
        throw { message: 'Réponse invalide du serveur' };
      }

      // Stockage dans le localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Retourne les données nécessaires
      return { token, user, success };
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de connexion' };
    }
  },

  verifyToken: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, message: 'Aucun token trouvé' };
      }

      const response = await api.get('/auth/me');
      return {
        success: true,
        user: response.data.data.user
      };
    } catch (error) {
      console.error('Erreur de vérification du token:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur de vérification du token'
      };
    }
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Changer le mot de passe
  changePassword: async (passwords) => {
    try {
      const response = await api.post('/auth/change-password', passwords);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors du changement de mot de passe' };
    }
  },

  // Vérifie si l'utilisateur est connecté
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Récupère l'utilisateur actuel
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Récupère le token
  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default authService;
