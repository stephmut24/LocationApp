import React from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Tooltip,
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
} from "@heroicons/react/24/outline";

const Sidbar = ({ isDrawerOpen, openDrawer, closeDrawer }) => {
  const [isHospitalsOpen, setIsHospitalsOpen] = React.useState(false);

  // Taille des icônes selon l'état de la sidebar
  const iconSize = isDrawerOpen ? "h-6 w-6" : "h-7 w-7";
  const iconColor = "text-gray-300"; // Légèrement plus clair pour une meilleure visibilité

  return (
    <div
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] ${
        isDrawerOpen ? "w-64" : "w-20"
      } bg-gray-900 transition-all duration-300 ease-in-out translate-x-0 z-40 shadow-lg overflow-y-auto`}
    >
      <div className={`p-4 ${!isDrawerOpen && "flex flex-col items-center"}`}>
        {/* Titre Dashboard - visible uniquement en mode étendu */}
        {isDrawerOpen && (
          <div className="mb-6">
            <Typography variant="h5" className="text-white font-bold">
              Dashboard
            </Typography>
          </div>
        )}

        <List className={`p-0 ${!isDrawerOpen && "w-full"}`}>
          {/* Gérer les hôpitaux */}
          {isDrawerOpen ? (
            <ListItem
              className="p-3 hover:bg-gray-800 rounded-lg mb-2 text-white cursor-pointer"
              onClick={() => setIsHospitalsOpen(!isHospitalsOpen)}
            >
              <div className="flex items-center w-full">
                <ListItemPrefix>
                  <BuildingOffice2Icon
                    className={`${iconSize} ${iconColor} mr-3`}
                  />
                </ListItemPrefix>
                <Typography className="mr-auto font-medium text-gray-200">
                  Gérer les hôpitaux
                </Typography>
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform duration-300 text-gray-400 ${
                    isHospitalsOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </ListItem>
          ) : (
            <Tooltip content="Gérer les hôpitaux" placement="right">
              <ListItem
                className="p-3 hover:bg-gray-800 rounded-lg mb-3 text-white cursor-pointer flex justify-center"
                onClick={() => openDrawer()}
              >
                <BuildingOffice2Icon className={`${iconSize} ${iconColor}`} />
              </ListItem>
            </Tooltip>
          )}

          {/* Sous-menu des hôpitaux - uniquement visible en mode étendu */}
          {isDrawerOpen && (
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isHospitalsOpen ? "max-h-48" : "max-h-0"
              }`}
            >
              <List className="p-0 ml-4">
                <ListItem className="p-3 hover:bg-gray-800 rounded-lg mb-1 text-white cursor-pointer">
                  <ListItemPrefix>
                    <PlusIcon className="h-5 w-5 text-gray-400 mr-3" />
                  </ListItemPrefix>
                  <Typography className="text-gray-200">Ajouter</Typography>
                </ListItem>
                <ListItem className="p-3 hover:bg-gray-800 rounded-lg mb-1 text-white cursor-pointer">
                  <ListItemPrefix>
                    <PencilIcon className="h-5 w-5 text-gray-400 mr-3" />
                  </ListItemPrefix>
                  <Typography className="text-gray-200">Modifier</Typography>
                </ListItem>
                <ListItem className="p-3 hover:bg-gray-800 rounded-lg mb-1 text-white cursor-pointer">
                  <ListItemPrefix>
                    <TrashIcon className="h-5 w-5 text-gray-400 mr-3" />
                  </ListItemPrefix>
                  <Typography className="text-gray-200">Supprimer</Typography>
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
    </div>
  );
};

export default Sidbar;
