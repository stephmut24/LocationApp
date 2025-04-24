
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

// ...existing code...

export const authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      // S'assurer que le middleware protect a été exécuté
      if (!req.headers.authorization) {
        console.log('Pas de token dans les headers');
        return res.status(401).json({
          success: false,
          message: 'Token non fourni'
        });
      }

      // Vérifier si l'utilisateur est connecté
      if (!req.user) {
        console.log('Utilisateur non authentifié');
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
      }

      // Vérifier le rôle
      if (!roles.includes(req.user.role)) {
        console.log(`Rôle ${req.user.role} non autorisé. Rôles permis:`, roles);
        return res.status(403).json({
          success: false,
          message: `Accès non autorisé. Rôle requis: ${roles.join(', ')}`
        });
      }

      // Si tout est OK, continuer
      console.log(`Accès autorisé pour ${req.user.email} avec rôle ${req.user.role}`);
      next();
    } catch (error) {
      console.error('Erreur dans authorize:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification des autorisations'
      });
    }
  };
};