import User from '../models/User.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Vérifier que l'email et le mot de passe existent
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Veuillez fournir un email et un mot de passe' 
      });
    }
    
    // Trouver l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email ou mot de passe incorrect' 
      });
    }
    
    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email ou mot de passe incorrect' 
      });
    }
    
    // Générer le token JWT
    const token = user.generateAuthToken();
    
    // Retourner la réponse avec le token et les infos utilisateur
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isFirstLogin: user.isFirstLogin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur de serveur lors de la connexion' 
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Utilisateur non trouvé' 
      });
    }
    
    // Vérifier l'ancien mot de passe
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Mot de passe actuel incorrect' 
      });
    }
    
    // Mettre à jour le mot de passe
    user.password = newPassword;
    user.isFirstLogin = false;
    user.updatedAt = Date.now();
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Mot de passe mis à jour avec succès'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur de serveur lors du changement de mot de passe' 
    });
  }
};