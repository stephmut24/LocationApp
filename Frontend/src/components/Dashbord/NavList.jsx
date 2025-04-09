import React from "react";
import { Link } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { HeartIcon, MoonIcon, SunIcon } from "@heroicons/react/24/outline";

const NavList = () => {
  return (
    <Navbar className="mx-auto max-w px-4 py-2 shadow-md bg-gray-200 rounded-none">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <HeartIcon className="h-11 w-11 text-red-600 " />
          <Typography className="ml-2 text-xl font-bold text-red-800 ">
            UrgenceCare
          </Typography>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Connexion
            </Button>
          </Link>

          <Link to="/">
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Urgence
            </Button>
          </Link>
        </div>
      </div>
    </Navbar>
  );
};

export default NavList;
