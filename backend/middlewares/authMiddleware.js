{/*import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    
    // Vérifier la présence du token dans l'en-tête
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Accès non autorisé, token manquant' 
      });
    }
    
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Trouver l'utilisateur par ID
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Utilisateur non trouvé' 
      });
    }
    
    // Ajouter l'utilisateur à la requête
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Token invalide ou expiré' 
    });
  }
};

// Middleware pour vérifier les rôles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Accès non autorisé pour ce rôle' 
      });
    }
    next();
  };
};*/}
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
  return (req, res, next) => {
    console.log('Vérification du rôle:', req.user.role); // Log pour déboguer
    console.log('Rôles autorisés:', roles); // Log pour déboguer
    
    if (!roles.includes(req.user.role)) {
      console.log('Accès refusé pour le rôle:', req.user.role); // Log pour déboguer
      return res.status(403).json({ 
        success: false, 
        message: `Accès non autorisé. Rôle requis: ${roles.join(', ')}` 
      });
    }
    console.log('Autorisation accordée'); // Log pour déboguer
    next();
  };
};