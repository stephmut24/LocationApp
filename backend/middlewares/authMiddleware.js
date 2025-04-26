
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    console.log('Headers reçus:', req.headers); // Log pour déboguer
    let token;
    
    // Vérifier la présence du token dans l'en-tête
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token extrait:', token); // Log pour déboguer
    }
    
    if (!token) {
      console.log('Pas de token trouvé'); // Log pour déboguer
      return res.status(401).json({ 
        success: false, 
        message: 'Accès non autorisé, token manquant' 
      });
    }
    
    try {
      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token décodé:', decoded); // Log pour déboguer
      
      // Trouver l'utilisateur par ID
      const user = await User.findById(decoded.userId);
      if (!user) {
        console.log('Utilisateur non trouvé pour ID:', decoded.userId); // Log pour déboguer
        return res.status(401).json({ 
          success: false, 
          message: 'Utilisateur non trouvé' 
        });
      }
      
      // Ajouter l'utilisateur complet à la requête
      req.user = user;
      console.log('Utilisateur authentifié:', user.email); // Log pour déboguer
      next();
    } catch (error) {
      console.error('Erreur de vérification du token:', error);
      return res.status(401).json({ 
        success: false, 
        message: 'Token invalide ou expiré',
        error: error.message 
      });
    }
  } catch (error) {
    console.error('Erreur middleware:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de l\'authentification',
      error: error.message
    });
  }
};



export const authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      // Vérifier si l'utilisateur est connecté
      if (!req.user) {
        console.log('Utilisateur non authentifié');
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
      }

      // Autorisation spéciale pour les hôpitaux
      if (req.user.role === 'hospital') {
        // Si c'est une route liée aux ambulances, autoriser l'accès
        if (req.baseUrl.includes('/hospitals') && req.path.includes('/ambulances')) {
          console.log(`Accès autorisé pour l'hôpital ${req.user.email}`);
          return next();
        }
      }

      // Pour les autres cas, vérifier si le rôle est dans la liste des rôles autorisés
      if (!roles.includes(req.user.role)) {
        console.log(`Rôle ${req.user.role} non autorisé pour cette route`);
        return res.status(403).json({
          success: false,
          message: 'Accès non autorisé pour cette ressource'
        });
      }

      console.log(`Accès autorisé pour ${req.user.email} avec le rôle ${req.user.role}`);
      next();
    } catch (error) {
      console.error('Erreur dans le middleware d\'autorisation:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification des autorisations'
      });
    }
  };
};