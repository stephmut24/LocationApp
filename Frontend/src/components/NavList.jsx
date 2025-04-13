import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Collapse,
} from "@material-tailwind/react";
import { HeartIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Sidbar from "./Sidbar";

const NavList = ({ isDrawerOpen, toggleDrawer }) => {
  const [openNav, setOpenNav] = useState(false);

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

  return (
    <>
      <Navbar className="w-full px-4 py-3 shadow-none bg-gray-900 border-b border-gray-800 rounded-none z-50 fixed top-0 left-0 right-0">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          {/* Logo et Bouton Menu */}
          <div className="flex items-center gap-4">
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
            <Link to="/" className="flex items-center gap-2">
              <HeartIcon className="h-8 w-8 text-red-500" />
              <Typography className="text-xl font-bold text-white">
                UrgenceCare
              </Typography>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-4">
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
            <Link to="/login" onClick={() => setOpenNav(false)}>
              <Button
                fullWidth
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Connexion
              </Button>
            </Link>
            <Link to="/" onClick={() => setOpenNav(false)}>
              <Button
                fullWidth
                className="bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Urgence
              </Button>
            </Link>
          </div>
        </Collapse>
      </Navbar>
    </>
  );
};

export default NavList;
