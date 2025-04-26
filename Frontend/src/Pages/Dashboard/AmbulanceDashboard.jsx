import React, { useState } from "react";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import {
  CheckCircleIcon,
  XCircleIcon,
  TruckIcon,
  ClockIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import ShowMap from "../../components/ShowMap";

const DashboardCard = ({ icon, title, value, description }) => (
  <Card>
    <CardBody className="flex items-center p-4">
      <div className="rounded-full p-3 bg-blue-50 mr-4">{icon}</div>
      <div>
        <Typography variant="h6" color="blue-gray">
          {title}
        </Typography>
        <Typography variant="h4" color="blue">
          {value}
        </Typography>
        <Typography color="gray" className="text-sm">
          {description}
        </Typography>
      </div>
    </CardBody>
  </Card>
);

function AmbulanceDashboard() {
  const [currentTask, setCurrentTask] = useState(null);
  const [interventionCount, setInterventionCount] = useState(0);

  const handleAcceptTask = () => {
    setCurrentTask({
      patientName: "John Doe",
      location: "123 Rue Test",
    });
  };

  const handleCompleteTask = () => {
    setCurrentTask(null);
    setInterventionCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-6 bg-gray-50">
        <div className="mb-1">
          <h1 className="text-xl font-bold text-gray-900">
            Tableau de bord Ambulance
          </h1>
          <p className="text-sm text-gray-600">Bienvenue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <DashboardCard
            icon={<TruckIcon className="h-6 w-6 text-blue-600" />}
            title="Status"
            value={currentTask ? "En mission" : "Disponible"}
            description="État actuel"
          />
          <DashboardCard
            icon={<ClockIcon className="h-6 w-6 text-green-600" />}
            title="Interventions"
            value={interventionCount}
            description="Interventions réalisées"
          />
          <DashboardCard
            icon={<UserIcon className="h-6 w-6 text-red-600" />}
            title="Patient"
            value={currentTask ? "Actif" : "Aucun"}
            description="Patient en charge"
          />
        </div>

        <div className="flex gap-4">
          <div className="bg-white rounded-lg shadow-md h-[600px] flex-1">
            <ShowMap />
          </div>

          <div className="bg-white rounded-lg shadow-md w-1/3 p-4">
            <Typography variant="h5" color="blue-gray" className="mb-4">
              Gestion des tâches
            </Typography>
            {currentTask ? (
              <div className="space-y-4">
                <Typography>Patient: {currentTask.patientName}</Typography>
                <Typography>Location: {currentTask.location}</Typography>
                <div className="space-y-2">
                  <Button
                    color="green"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleCompleteTask}
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                    Terminer la tâche
                  </Button>
                  <Button
                    color="red"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleCompleteTask}
                  >
                    <XCircleIcon className="h-5 w-5" />
                    Signaler fin de tâche
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                color="blue"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleAcceptTask}
              >
                <CheckCircleIcon className="h-5 w-5" />
                Accepter une tâche
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AmbulanceDashboard;
