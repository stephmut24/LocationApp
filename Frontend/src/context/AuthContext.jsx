import { createContext, useContext, useState, useEffect } from "react";
import authService from "../Services/authService";

// Créer le contexte
const AuthContext = createContext();

// Hook personnalisé
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};

// Fournisseur du contexte
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isHospital = () => {
    return user?.role === "hospital";
  };

  const getHospitalId = () => {
    return user?.hospital;
  };

  const hasPermission = (requiredRole) => {
    return user?.role === requiredRole;
  };

  // Charger les données utilisateur depuis localStorage au démarrage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (storedUser && token) {
          const userData = JSON.parse(storedUser);
          // Vérifier la validité du token
          const response = await authService.verifyToken();
          if (response.success) {
            setUser(userData);
          } else {
            // Si le token n'est plus valide, déconnexion
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await authService.login(credentials);
      setUser(response.user);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const updateUser = (newData) => {
    try {
      const updatedUser = { ...user, ...newData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      setError("Erreur lors de la mise à jour du profil");
    }
  };

  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        loading,
        error,
        isAuthenticated,
        isHospital,
        getHospitalId,
        hasPermission,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
