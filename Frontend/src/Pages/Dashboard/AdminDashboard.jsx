import React, { useState, useEffect } from "react";
import { Building2, Users, Ambulance, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Sidbar from "../../components/Sidbar";
import NavList from "../../components/NavList";
import ShowMap from "../../components/ShowMap";

const AdminDashboard = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated() || user?.role !== "admin") {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  // Fonction pour gérer le toggle depuis la sidebar
  const handleSidebarToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar avec contrôle sur l'état de la sidebar */}
      <NavList isDrawerOpen={isDrawerOpen} toggleDrawer={handleSidebarToggle} />

      {/* Sidebar qui prend l'état du dashboard */}
      <Sidbar
        isDrawerOpen={isDrawerOpen}
        openDrawer={() => setIsDrawerOpen(true)}
        closeDrawer={() => setIsDrawerOpen(false)}
      />

      {/* Contenu principal avec décalage dynamique */}
      <div
        className={`pt-20 transition-all duration-300 ${
          isDrawerOpen ? "ml-64" : "ml-16"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-1">
            <h1 className="text-xl font-bold text-gray-900">
              Tableau de bord administrateur
            </h1>
            <p className="text-sm text-gray-600">Bienvenue, </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <DashboardCard
              icon={<Building2 className="h-6 w-6 text-blue-600" />}
              title="Hôpitaux"
              value="6"
              description="Hôpitaux actifs"
            />
            <DashboardCard
              icon={<Ambulance className="h-6 w-6 text-red-600" />}
              title="Ambulances"
              value="12"
              description="Véhicules en service"
            />
            <DashboardCard
              icon={<Users className="h-6 w-6 text-green-600" />}
              title="Interventions"
              value="5"
              description="Ce mois-ci"
            />
            <DashboardCard
              icon={<Settings className="h-6 w-6 text-gray-600" />}
              title="Système"
              value="100%"
              description="Disponibilité"
            />
          </div>

          {/* Espace pour la carte Mapbox */}

          <div className="bg-white rounded-lg shadow-md h-96 flex-1">
            {/* La carte Mapbox sera ajoutée ici */}
            <ShowMap />
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ icon, title, value, description }) => (
  <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
    <div className="flex items-center justify-between mb-2">
      <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
      <span className="text-2xl font-bold text-gray-900">{value}</span>
    </div>
    <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
    <p className="text-xs text-gray-600">{description}</p>
  </div>
);

export default AdminDashboard;
