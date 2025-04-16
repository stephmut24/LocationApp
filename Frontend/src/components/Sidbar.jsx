import React, { useState } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Tooltip,
  Dialog,
} from "@material-tailwind/react";
import {
  BuildingOffice2Icon,
  MapIcon,
  Cog6ToothIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChevronDownIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  InformationCircleIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  MinusIcon,
} from "@heroicons/react/24/outline";
import HospitalForm from "./HopitalForm";
import ConfirmDialog from "./ConfirmDialog";

const Sidbar = ({
  isDrawerOpen,
  openDrawer,
  closeDrawer,
  mode = "hospital",
}) => {
  const [isHospitalsOpen, setIsHospitalsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [selectedHospital, setSelectedHospital] = useState(null);

  // Taille des icônes selon l'état de la sidebar
  const iconSize = isDrawerOpen ? "h-6 w-6" : "h-7 w-7";
  const iconColor = "text-gray-300";

  // Configuration dynamique selon le mode
  const managementConfig = {
    hospital: {
      label: "Gérer les hôpitaux",
      icon: BuildingOffice2Icon,
      addLabel: "Ajouter",
      editLabel: "Modifier",
      deleteLabel: "Supprimer",
      deleteMessage: "Êtes-vous sûr de vouloir supprimer cet hôpital ?",
    },
    ambulance: {
      label: "Gérer les ambulances",
      icon: TruckIcon,
      addLabel: "Ajouter",
      editLabel: "Modifier",
      deleteLabel: "Supprimer",
      deleteMessage: "Êtes-vous sûr de vouloir supprimer cette ambulance ?",
    },
    emergency: {
      label: "Gérer les urgences",
      icon: ExclamationTriangleIcon,
      assignLabel: "Assigner Ambulance",
      unassignLabel: "Désassigner Ambulance",
    },
  };

  const config = managementConfig[mode];

  const handleAdd = () => {
    setFormMode("add");
    setSelectedHospital(null);
    setFormOpen(true);
  };

  const handleEdit = () => {
    setFormMode("edit");
    setSelectedHospital({
      name: mode === "hospital" ? "Nom de l'hôpital" : "Nom de l'ambulance",
      email: "email@exemple.com",
      address: "Adresse",
      location: {
        coordinates: [0, 0],
      },
    });
    setFormOpen(true);
  };

  const handleDelete = () => {
    setConfirmOpen(true);
  };

  const handleAssignAmbulance = () => {
    console.log("Assigner une ambulance à une urgence");
    // Ici vous pourriez ouvrir un formulaire ou une modal
  };

  const handleUnassignAmbulance = () => {
    console.log("Désassigner une ambulance d'une urgence");
    // Ici vous pourriez ouvrir un formulaire ou une modal
  };

  const handleSubmit = async (data) => {
    try {
      const endpoint = mode === "hospital" ? "hospitals" : "ambulances";
      let response;

      if (formMode === "add") {
        response = await fetch(`/api/${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      } else {
        response = await fetch(`/api/${endpoint}/${selectedHospital._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      }

      const text = await response.text();
      const result = text ? JSON.parse(text) : {};

      if (!response.ok)
        throw new Error(result.message || "Une erreur est survenue");
    } catch (error) {
      console.error("Erreur:", error);
      throw error;
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const endpoint = mode === "hospital" ? "hospitals" : "ambulances";
      const response = await fetch(`/api/${endpoint}/${selectedHospital._id}`, {
        method: "DELETE",
      });

      const text = await response.text();
      const result = text ? JSON.parse(text) : {};

      if (!response.ok)
        throw new Error(result.message || "Erreur lors de la suppression");

      setConfirmOpen(false);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <div
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] ${
        isDrawerOpen ? "w-64" : "w-20"
      } bg-gray-900 transition-all duration-300 ease-in-out translate-x-0 z-40 shadow-lg overflow-y-auto`}
    >
      <div className={`p-4 ${!isDrawerOpen && "flex flex-col items-center"}`}>
        {isDrawerOpen && (
          <div className="mb-6">
            <Typography variant="h5" className="text-white font-bold">
              Dashboard
            </Typography>
          </div>
        )}

        <List className={`p-0 ${!isDrawerOpen && "w-full"}`}>
          {/* Section Gérer les hôpitaux/ambulances */}
          {isDrawerOpen ? (
            <ListItem
              className="p-3 hover:bg-gray-800 rounded-lg mb-2 text-white cursor-pointer"
              onClick={() => setIsHospitalsOpen(!isHospitalsOpen)}
            >
              <div className="flex items-center w-full">
                <ListItemPrefix>
                  <config.icon className={`${iconSize} ${iconColor} mr-3`} />
                </ListItemPrefix>
                <Typography className="mr-auto font-medium text-gray-200">
                  {config.label}
                </Typography>
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform duration-300 text-gray-400 ${
                    isHospitalsOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </ListItem>
          ) : (
            <Tooltip content={config.label} placement="right">
              <ListItem
                className="p-3 hover:bg-gray-800 rounded-lg mb-3 text-white cursor-pointer flex justify-center"
                onClick={() => openDrawer()}
              >
                <config.icon className={`${iconSize} ${iconColor}`} />
              </ListItem>
            </Tooltip>
          )}

          {/* Sous-menu des hôpitaux/ambulances */}
          {isDrawerOpen && (
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isHospitalsOpen ? "max-h-48" : "max-h-0"
              }`}
            >
              <List className="p-0 ml-4">
                <ListItem
                  className="p-3 hover:bg-gray-800 rounded-lg mb-1 text-white cursor-pointer"
                  onClick={handleAdd}
                >
                  <ListItemPrefix>
                    <PlusIcon className="h-5 w-5 text-gray-400 mr-3" />
                  </ListItemPrefix>
                  <Typography className="text-gray-200">
                    {config.addLabel}
                  </Typography>
                </ListItem>
                <ListItem
                  className="p-3 hover:bg-gray-800 rounded-lg mb-1 text-white cursor-pointer"
                  onClick={handleEdit}
                >
                  <ListItemPrefix>
                    <PencilIcon className="h-5 w-5 text-gray-400 mr-3" />
                  </ListItemPrefix>
                  <Typography className="text-gray-200">
                    {config.editLabel}
                  </Typography>
                </ListItem>
                <ListItem
                  className="p-3 hover:bg-gray-800 rounded-lg mb-1 text-white cursor-pointer"
                  onClick={handleDelete}
                >
                  <ListItemPrefix>
                    <TrashIcon className="h-5 w-5 text-gray-400 mr-3" />
                  </ListItemPrefix>
                  <Typography className="text-gray-200">
                    {config.deleteLabel}
                  </Typography>
                </ListItem>
              </List>
            </div>
          )}

          {/* Section Gérer les urgences */}
          {isDrawerOpen ? (
            <ListItem className="p-3 hover:bg-gray-800 rounded-lg mb-2 text-white cursor-pointer">
              <ListItemPrefix>
                <ExclamationTriangleIcon
                  className={`${iconSize} ${iconColor} mr-3`}
                />
              </ListItemPrefix>
              <Typography className="text-gray-200">
                Gérer les urgences
              </Typography>
            </ListItem>
          ) : (
            <Tooltip content="Gérer les urgences" placement="right">
              <ListItem className="p-3 hover:bg-gray-800 rounded-lg mb-3 text-white cursor-pointer flex justify-center">
                <ExclamationTriangleIcon
                  className={`${iconSize} ${iconColor}`}
                />
              </ListItem>
            </Tooltip>
          )}

          {/* Sous-menu des urgences (seulement visible en mode ouvert) */}
          {isDrawerOpen && (
            <div className="overflow-hidden transition-all duration-300 max-h-48">
              <List className="p-0 ml-4">
                <ListItem
                  className="p-3 hover:bg-gray-800 rounded-lg mb-1 text-white cursor-pointer"
                  onClick={handleAssignAmbulance}
                >
                  <ListItemPrefix>
                    <PlusIcon className="h-5 w-5 text-gray-400 mr-3" />
                  </ListItemPrefix>
                  <Typography className="text-gray-200">
                    Assigner Ambulance
                  </Typography>
                </ListItem>
                <ListItem
                  className="p-3 hover:bg-gray-800 rounded-lg mb-1 text-white cursor-pointer"
                  onClick={handleUnassignAmbulance}
                >
                  <ListItemPrefix>
                    <MinusIcon className="h-5 w-5 text-gray-400 mr-3" />
                  </ListItemPrefix>
                  <Typography className="text-gray-200">
                    Désassigner Ambulance
                  </Typography>
                </ListItem>
              </List>
            </div>
          )}

          {/* Afficher la carte */}
          {isDrawerOpen ? (
            <ListItem className="p-3 hover:bg-gray-800 rounded-lg mb-2 text-white cursor-pointer">
              <ListItemPrefix>
                <MapIcon className={`${iconSize} ${iconColor} mr-3`} />
              </ListItemPrefix>
              <Typography className="text-gray-200">
                Afficher la carte
              </Typography>
            </ListItem>
          ) : (
            <Tooltip content="Afficher la carte" placement="right">
              <ListItem className="p-3 hover:bg-gray-800 rounded-lg mb-3 text-white cursor-pointer flex justify-center">
                <MapIcon className={`${iconSize} ${iconColor}`} />
              </ListItem>
            </Tooltip>
          )}

          {/* Surveiller les flux */}
          {isDrawerOpen ? (
            <ListItem className="p-3 hover:bg-gray-800 rounded-lg mb-2 text-white cursor-pointer">
              <ListItemPrefix>
                <ChartBarIcon className={`${iconSize} ${iconColor} mr-3`} />
              </ListItemPrefix>
              <Typography className="text-gray-200">
                Surveiller les flux
              </Typography>
            </ListItem>
          ) : (
            <Tooltip content="Surveiller les flux" placement="right">
              <ListItem className="p-3 hover:bg-gray-800 rounded-lg mb-3 text-white cursor-pointer flex justify-center">
                <ChartBarIcon className={`${iconSize} ${iconColor}`} />
              </ListItem>
            </Tooltip>
          )}

          {/* Paramètres */}
          {isDrawerOpen ? (
            <ListItem className="p-3 hover:bg-gray-800 rounded-lg mb-2 text-white cursor-pointer">
              <ListItemPrefix>
                <Cog6ToothIcon className={`${iconSize} ${iconColor} mr-3`} />
              </ListItemPrefix>
              <Typography className="text-gray-200">Paramètres</Typography>
            </ListItem>
          ) : (
            <Tooltip content="Paramètres" placement="right">
              <ListItem className="p-3 hover:bg-gray-800 rounded-lg mb-3 text-white cursor-pointer flex justify-center">
                <Cog6ToothIcon className={`${iconSize} ${iconColor}`} />
              </ListItem>
            </Tooltip>
          )}

          {/* Se déconnecter */}
          {isDrawerOpen ? (
            <ListItem className="p-3 hover:bg-gray-800 rounded-lg mb-2 text-white cursor-pointer">
              <ListItemPrefix>
                <ArrowRightOnRectangleIcon
                  className={`${iconSize} ${iconColor} mr-3`}
                />
              </ListItemPrefix>
              <Typography className="text-gray-200">Se déconnecter</Typography>
            </ListItem>
          ) : (
            <Tooltip content="Se déconnecter" placement="right">
              <ListItem className="p-3 hover:bg-gray-800 rounded-lg mb-3 text-white cursor-pointer flex justify-center">
                <ArrowRightOnRectangleIcon
                  className={`${iconSize} ${iconColor}`}
                />
              </ListItem>
            </Tooltip>
          )}

          {/* À propos */}
          {isDrawerOpen ? (
            <ListItem className="p-3 hover:bg-gray-800 rounded-lg text-white cursor-pointer">
              <ListItemPrefix>
                <InformationCircleIcon
                  className={`${iconSize} ${iconColor} mr-3`}
                />
              </ListItemPrefix>
              <Typography className="text-gray-200">À propos</Typography>
            </ListItem>
          ) : (
            <Tooltip content="À propos" placement="right">
              <ListItem className="p-3 hover:bg-gray-800 rounded-lg text-white cursor-pointer flex justify-center">
                <InformationCircleIcon className={`${iconSize} ${iconColor}`} />
              </ListItem>
            </Tooltip>
          )}
        </List>
      </div>

      <Dialog open={formOpen} handler={() => setFormOpen(false)}>
        <HospitalForm
          mode={formMode}
          initialData={selectedHospital}
          onClose={() => setFormOpen(false)}
          onSubmit={handleSubmit}
          entityType={mode}
        />
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`Confirmer la suppression`}
        message={config.deleteMessage}
      />
    </div>
  );
};

export default Sidbar;
