import React, { useState } from "react";
import { Ambulance, Users, Settings } from "lucide-react";
import Sidbar from "../../components/Sidbar";
import NavList from "../../components/NavList";
import ShowMap from "../../components/ShowMap";

const HospitalDashboard = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
        mode="ambulance"
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
              Tableau de bord de l'hôpital
            </h1>
            <p className="text-sm text-gray-600">Bienvenue à l'hôpital</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <DashboardCard
              icon={<Ambulance className="h-6 w-6 text-red-600" />}
              title="Ambulances"
              value="45"
              description="Ambulances disponibles"
            />
            <DashboardCard
              icon={<Users className="h-6 w-6 text-green-600" />}
              title="Patients"
              value="123"
              description="Nombre de patients"
            />
            <DashboardCard
              icon={<Settings className="h-6 w-6 text-gray-600" />}
              title="Système"
              value="100%"
              description="Disponibilité du système"
            />
            <DashboardCard
              icon={<Ambulance className="h-6 w-6 text-blue-600" />}
              title="Interventions"
              value="65"
              description="Interventions en cours"
            />
          </div>

          {/* Espace pour la carte Mapbox */}
          <div className="flex gap-4">
            <div className="bg-white rounded-lg shadow-md h-96 flex-1">
              {/* La carte Mapbox sera ajoutée ici */}
              <ShowMap />
            </div>
            <div className="bg-white rounded-lg shadow-md h-96 w-1/3"></div>
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

export default HospitalDashboard;
