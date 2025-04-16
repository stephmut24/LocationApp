import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Collapse,
  Avatar,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Badge,
} from "@material-tailwind/react";
import {
  HeartIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

const NavList = ({ isDrawerOpen, toggleDrawer }) => {
  const navigate = useNavigate();
  const [openNav, setOpenNav] = useState(false);
  const [notificationsCount] = useState(3); // Pour l'exemple
  const { user, logout } = useAuth();

  // Permet de fermer le menu mobile quand on redimensionne l'écran
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) {
        setOpenNav(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Détermine quels boutons afficher en fonction de l'authentification et du rôle
  const renderAuthButtons = () => {
    if (!user) {
      // Utilisateur non connecté
      return (
        <>
          <Link to="/login">
            <Button
              size="lm"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Connexion
            </Button>
          </Link>
          <Link to="/">
            <Button
              size="lm"
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Urgence
            </Button>
          </Link>
        </>
      );
    } else {
      // Utilisateur connecté
      return (
        <>
          {/* Bouton de notifications */}
          <Badge content={notificationsCount} className="bg-red-500 mr-2">
            <IconButton className="rounded-full bg-gray-800 text-white inline-flex items-center">
              <BellIcon className="h-6 w-6" />
            </IconButton>
          </Badge>

          {/* Menu du profil utilisateur */}
          <Menu>
            <MenuHandler>
              <Button
                variant="text"
                className="p-0 items-center gap-2 rounded inline-flex align-middle"
              >
                <Avatar
                  size="sm"
                  variant="circular"
                  className="border-2 border-white bg-gray-700 rounded-full flex items-center justify-center"
                />
                <span className="hidden lg:inline text-white text-xl">
                  {user.role === "admin"
                    ? "Administrateur"
                    : user.role === "hospital"
                    ? "Hôpital"
                    : user.role === "ambulance"
                    ? "Ambulance"
                    : "Utilisateur"}
                </span>
              </Button>
            </MenuHandler>
            <MenuList className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-[1000] mt-1 min-w-[100px]">
              <MenuItem className="flex items-center gap-2 hover:bg-gray-800 px-4 py-2.5 transition-colors">
                <UserCircleIcon className="h-5 w-5 text-blue-400" />
                <span className="text-white">Profil</span>
              </MenuItem>

              {/* Éléments de menu spécifiques au rôle */}
              {user.role === "admin" && (
                <MenuItem className="hover:bg-gray-800 px-4 py-2.5 transition-colors">
                  <Link
                    to="/admin"
                    className="w-full text-white hover:text-blue-300 block"
                  >
                    Tableau de bord
                  </Link>
                </MenuItem>
              )}
              {user.role === "hospital" && (
                <MenuItem className="hover:bg-gray-800 px-4 py-2.5 transition-colors">
                  <Link
                    to="/hospital/dashboard"
                    className="w-full text-white hover:text-blue-300 block"
                  >
                    Gestion Hôpital
                  </Link>
                </MenuItem>
              )}
              {user.role === "ambulance" && (
                <MenuItem className="hover:bg-gray-800 px-4 py-2.5 transition-colors">
                  <Link
                    to="/ambulance/dashboard"
                    className="w-full text-white hover:text-blue-300 block"
                  >
                    Gestion Ambulance
                  </Link>
                </MenuItem>
              )}

              <MenuItem
                onClick={() => {
                  logout();
                  navigate("/", { replace: true });
                  window.location.reload();
                }}
                className="text-red-500 hover:bg-red-500/10 px-4 py-2.5 border-t border-gray-800 mt-1 transition-colors"
              >
                Déconnexion
              </MenuItem>
            </MenuList>
          </Menu>
        </>
      );
    }
  };

  // Détermine quels boutons afficher dans le menu mobile
  const renderMobileAuthButtons = () => {
    if (!user) {
      // Utilisateur non connecté
      return (
        <>
          <Link
            to="/login"
            onClick={() => setOpenNav(false)}
            className="w-full"
          >
            <Button
              fullWidth
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Connexion
            </Button>
          </Link>
          <Link to="/" onClick={() => setOpenNav(false)} className="w-full">
            <Button
              fullWidth
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Urgence
            </Button>
          </Link>
        </>
      );
    } else {
      // Utilisateur connecté
      return (
        <>
          <Link
            to="/profile"
            onClick={() => setOpenNav(false)}
            className="w-full"
          >
            <Button
              fullWidth
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <UserCircleIcon className="h-5 w-5" />
              Profil
            </Button>
          </Link>

          <Link
            to="/notifications"
            onClick={() => setOpenNav(false)}
            className="w-full"
          >
            <Button
              fullWidth
              className="bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <BellIcon className="h-5 w-5" />
              Notifications{" "}
              {notificationsCount > 0 && `(${notificationsCount})`}
            </Button>
          </Link>

          {/* Liens spécifiques au rôle */}
          {user.role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setOpenNav(false)}
              className="w-full"
            >
              <Button
                fullWidth
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
              >
                Tableau de bord Admin
              </Button>
            </Link>
          )}
          {user.role === "hospital" && (
            <Link
              to="/hospital/dashboard"
              onClick={() => setOpenNav(false)}
              className="w-full"
            >
              <Button
                fullWidth
                className="bg-green-600 hover:bg-green-700 text-white rounded-lg"
              >
                Gestion Hôpital
              </Button>
            </Link>
          )}
          {user.role === "ambulance" && (
            <Link
              to="/ambulance/dashboard"
              onClick={() => setOpenNav(false)}
              className="w-full"
            >
              <Button
                fullWidth
                className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg"
              >
                Gestion Ambulance
              </Button>
            </Link>
          )}

          <Button
            fullWidth
            onClick={() => {
              logout();
              setOpenNav(false);
            }}
            className="bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300"
          >
            Déconnexion
          </Button>
        </>
      );
    }
  };

  return (
    <>
      <Navbar className="w-full px-4 py-3 shadow-none bg-gray-900 border-b border-gray-800 rounded-none z-50 fixed top-0 left-0 right-0">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          {/* Logo et Bouton Menu - Bouton visible uniquement si utilisateur connecté */}
          <div className="flex items-center gap-4">
            {user && (
              <button
                onClick={toggleDrawer}
                className="text-gray-400 hover:text-white p-2"
              >
                {isDrawerOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            )}
            <Link to="/" className="flex items-center gap-2">
              <HeartIcon className="h-8 w-8 text-red-500" />
              <Typography className="text-xl font-bold text-white">
                UrgenceCare
              </Typography>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-4">
            {renderAuthButtons()}
          </div>

          {/* Mobile Toggle Button */}
          <IconButton
            variant="text"
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </IconButton>
        </div>

        {/* Mobile Menu */}
        <Collapse open={openNav}>
          <div className="flex flex-col items-start gap-3 mt-4 lg:hidden">
            {renderMobileAuthButtons()}
          </div>
        </Collapse>
      </Navbar>
    </>
  );
};

export default NavList;
