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
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import HospitalForm from "./HopitalForm";
import AmbulanceForm from "./AmbulanceForm";
import ConfirmDialog from "./ConfirmDialog";

const Sidbar = ({ isDrawerOpen, openDrawer, mode = "hospital" }) => {
  const [isHospitalsOpen, setIsHospitalsOpen] = useState(false);
  const [isEmergenciesOpen, setIsEmergenciesOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const { isHospital, logout } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedAmbulance, setSelectedAmbulance] = useState(null); // Ajout de la variable manquante

  // Taille des icônes selon l'état de la sidebar
  const iconSize = isDrawerOpen ? "h-6 w-6" : "h-7 w-7";
  const iconColor = "text-gray-300";

  // Configuration dynamique selon le mode
  const managementConfig = {
    hospital: {
      label: isHospital() ? "Mes ambulances" : "Gérer les hôpitaux",
      icon: isHospital() ? TruckIcon : BuildingOffice2Icon,
      addLabel: "Ajouter",
      editLabel: "Modifier",
      deleteLabel: "Supprimer",
      deleteMessage: isHospital()
        ? "Êtes-vous sûr de vouloir supprimer cette ambulance ?"
        : "Êtes-vous sûr de vouloir supprimer cet hôpital ?",
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
    setSelectedAmbulance(null); // Réinitialiser aussi l'ambulance sélectionnée
    setFormOpen(true);
  };

  const handleEdit = () => {
    setFormMode("edit");

    // Définir l'entité à éditer selon le mode
    if (mode === "hospital") {
      setSelectedHospital({
        name: "Nom de l'hôpital",
        email: "email@exemple.com",
        address: "Adresse",
        location: {
          coordinates: [0, 0],
        },
        _id: "temp-id", // Ajout d'un ID temporaire pour éviter les erreurs
      });
      setSelectedAmbulance(null);
    } else {
      setSelectedAmbulance({
        name: "Nom de l'ambulance",
        email: "email@exemple.com",
        address: "Adresse",
        location: {
          coordinates: [0, 0],
        },
        _id: "temp-id", // Ajout d'un ID temporaire pour éviter les erreurs
      });
    }

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
      // Import dynamique des services
      const [hospitalService, ambulanceService] = await Promise.all([
        import("../Services/hopitalService").then((m) => m.default),
        import("../Services/ambulanceService").then((m) => m.default),
      ]);

      console.log(`Tentative ${formMode} pour ${mode}:`, data);

      // Vérifier si tous les champs requis sont présents
      if (
        !data.name ||
        !data.email ||
        !data.phone ||
        !data.address ||
        !data.location
      ) {
        throw new Error("Tous les champs sont requis");
      }

      // Formater les données avant l'envoi
      const formattedData = {
        ...data,
        location: {
          type: "Point",
          coordinates: Array.isArray(data.location)
            ? data.location
            : data.location.coordinates || [0, 0],
        },
      };

      // Fermer le formulaire avant la requête
      setFormOpen(false);

      let response;
      if (mode === "hospital") {
        response =
          formMode === "add"
            ? await hospitalService.addHospital(formattedData)
            : await hospitalService.updateHospital(
                selectedHospital._id,
                formattedData
              );
      } else {
        response =
          formMode === "add"
            ? await ambulanceService.addAmbulance(formattedData)
            : await ambulanceService.updateAmbulance(
                selectedAmbulance._id,
                formattedData
              );
      }

      // Vérifier la réponse
      if (!response || !response.success) {
        throw new Error(response?.message || "Une erreur est survenue");
      }

      // Émettre l'événement de rafraîchissement
      const eventName =
        mode === "hospital" ? "hospitalAdded" : "ambulanceAdded";
      window.dispatchEvent(
        new CustomEvent(eventName, { detail: response.data })
      );

      // Notification de succès
      toast.success(
        `${mode === "hospital" ? "Hôpital" : "Ambulance"} ${
          formMode === "add" ? "ajouté" : "mis à jour"
        } avec succès!`
      );
    } catch (error) {
      console.error("Erreur détaillée:", error);
      toast.error(error.message || "Une erreur est survenue");
      // Rouvrir le formulaire en cas d'erreur
      setFormOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const endpoint = mode === "hospital" ? "hospitals" : "ambulances";
      const token = localStorage.getItem("token");
      // Utiliser le même baseUrl que pour les autres opérations
      const baseUrl = mode === "hospital" ? "/admin" : "/api";

      // Utiliser l'ID de l'entité appropriée selon le mode
      const idToUse =
        mode === "hospital"
          ? selectedHospital?._id || "temp-id"
          : selectedAmbulance?._id || "temp-id";

      const response = await fetch(`${baseUrl}/${endpoint}/${idToUse}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await response.text();
      const result = text ? JSON.parse(text) : {};

      if (!response.ok)
        throw new Error(result.message || "Erreur lors de la suppression");

      setConfirmOpen(false);

      // Rafraîchir les données après la suppression
      const eventName =
        mode === "hospital" ? "hospitalAdded" : "ambulanceAdded";
      window.dispatchEvent(new CustomEvent(eventName, { detail: [] }));
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Redirection vers la page de connexion ou autre
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  // Détermine si on est dans l'interface hôpital (avec gestion d'ambulances)
  const isHospitalInterface = mode === "ambulance";

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

          {/* Section Gérer les urgences - Seulement visible dans l'interface hôpital */}
          {isHospitalInterface && (
            <>
              {isDrawerOpen ? (
                <ListItem
                  className="p-3 hover:bg-gray-800 rounded-lg mb-2 text-white cursor-pointer"
                  onClick={() => setIsEmergenciesOpen(!isEmergenciesOpen)}
                >
                  <div className="flex items-center w-full">
                    <ListItemPrefix>
                      <ExclamationTriangleIcon
                        className={`${iconSize} ${iconColor} mr-3`}
                      />
                    </ListItemPrefix>
                    <Typography className="mr-auto font-medium text-gray-200">
                      Gérer les urgences
                    </Typography>
                    <ChevronDownIcon
                      className={`h-4 w-4 transition-transform duration-300 text-gray-400 ${
                        isEmergenciesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
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

              {/* Sous-menu des urgences (seulement visible en mode ouvert et dans l'interface hôpital) */}
              {isDrawerOpen && (
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isEmergenciesOpen ? "max-h-48" : "max-h-0"
                  }`}
                >
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
            </>
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
            <ListItem
              className="p-3 hover:bg-gray-800 rounded-lg mb-2 text-white cursor-pointer"
              onClick={handleLogout} // Ajout du gestionnaire d'événement manquant
            >
              <ListItemPrefix>
                <ArrowRightOnRectangleIcon
                  className={`${iconSize} ${iconColor} mr-3`}
                />
              </ListItemPrefix>
              <Typography className="text-gray-200">Se déconnecter</Typography>
            </ListItem>
          ) : (
            <Tooltip content="Se déconnecter" placement="right">
              <ListItem
                className="p-3 hover:bg-gray-800 rounded-lg mb-3 text-white cursor-pointer flex justify-center"
                onClick={handleLogout} // Ajout du gestionnaire d'événement manquant
              >
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
        {mode === "hospital" ? (
          <HospitalForm
            mode={formMode}
            initialData={selectedHospital}
            onClose={() => setFormOpen(false)}
            onSubmit={handleSubmit}
            entityType={mode}
          />
        ) : (
          <AmbulanceForm
            mode={formMode}
            initialData={selectedAmbulance || selectedHospital} // Utiliser la bonne entité selon le mode
            onClose={() => setFormOpen(false)}
            onSubmit={handleSubmit}
          />
        )}
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
