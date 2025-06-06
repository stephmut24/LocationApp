import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";

import NavList from "./components/NavList";
import { AuthProvider } from "./context/AuthContext";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import "mapbox-gl/dist/mapbox-gl.css";
import AdminDashboard from "./Pages/Dashboard/AdminDashboard";
import HospitalDashboard from "./Pages/Dashboard/HospitalDashboard";
import AmbulanceDashboard from "./Pages/Dashboard/AmbulanceDashboard";
import Loader from "./components/Loader";
import ProtectedRoute from "./components/ProtectedRoute";

// Composant principal qui gère le routing + loader
const AppContent = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fonction pour gérer le toggle depuis la NavList
  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000); // simule un petit chargement
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {loading && <Loader />}
      <NavList isDrawerOpen={isDrawerOpen} toggleDrawer={handleDrawerToggle} />
      <div
        className={`pt-5 transition-all duration-300 ${
          isDrawerOpen ? "ml-64" : "ml-0"
        }`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard
                  isDrawerOpen={isDrawerOpen}
                  toggleDrawer={handleDrawerToggle}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/hopital"
            element={
              <ProtectedRoute allowedRoles={["hospital"]}>
                <HospitalDashboard
                  isDrawerOpen={isDrawerOpen}
                  toggleDrawer={handleDrawerToggle}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ambulance"
            element={
              <ProtectedRoute allowedRoles={["ambulance"]}>
                <AmbulanceDashboard
                  isDrawerOpen={isDrawerOpen}
                  toggleDrawer={handleDrawerToggle}
                />
              </ProtectedRoute>
            }
          />
          {/* Ajoutez d'autres routes ici */}
        </Routes>
      </div>
    </div>
  );
};

// App "global" qui enveloppe tout dans le Router et l'AuthProvider
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
