import React, { useState } from "react";
import {
  Card,
  Input,
  Button,
  Typography,
  IconButton,
  Alert,
} from "@material-tailwind/react";
import Map, { Marker } from "react-map-gl";
import { MAPBOX_TOKEN } from "../utils/mapboxConfig.js";
import "mapbox-gl/dist/mapbox-gl.css";
import { XMarkIcon } from "@heroicons/react/24/outline";
import ambulanceService from "../Services/ambulanceService.js";

const styleOptions = {
  standard: "mapbox://styles/steph-24/cm9gwmiai007r01sg1nk5d0pf",
  satellite: "mapbox://styles/steph-24/cm9gx5dk800fg01spb5yq4tet",
};

const AmbulanceForm = ({
  mode = "add",
  initialData = {},
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    registrationNumber: initialData?.registrationNumber || "",
    driverEmail: initialData?.driverEmail || "",
    driverPhone: initialData?.driverPhone || "",
    location: initialData?.location?.coordinates || [29.2356, -1.6835],
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mapStyle, setMapStyle] = useState("standard");
  const [viewState, setViewState] = useState({
    longitude: formData.location[0],
    latitude: formData.location[1],
    zoom: 14,
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [longitudeInput, setLongitudeInput] = useState(
    formData.location[0].toString()
  );
  const [latitudeInput, setLatitudeInput] = useState(
    formData.location[1].toString()
  );

  const handleClose = () => {
    if (typeof onClose === "function") {
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMapClick = (event) => {
    const { lngLat } = event;
    setFormData((prev) => ({
      ...prev,
      location: [lngLat.lng, lngLat.lat],
    }));
    setLongitudeInput(lngLat.lng.toString());
    setLatitudeInput(lngLat.lat.toString());
  };

  const handleCoordinateChange = (e, coordinateType) => {
    const value = e.target.value;
    if (coordinateType === "longitude") {
      setLongitudeInput(value);
      if (!isNaN(parseFloat(value))) {
        const newLongitude = parseFloat(value);
        setFormData((prev) => ({
          ...prev,
          location: [newLongitude, prev.location[1]],
        }));
      }
    } else {
      setLatitudeInput(value);
      if (!isNaN(parseFloat(value))) {
        const newLatitude = parseFloat(value);
        setFormData((prev) => ({
          ...prev,
          location: [prev.location[0], newLatitude],
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const newErrors = {};
    if (!formData.registrationNumber) {
      newErrors.registrationNumber = "Le numéro d'immatriculation est requis";
    }
    if (!formData.driverEmail) {
      newErrors.driverEmail = "L'email de l'ambulancier est requis";
    }
    if (!formData.driverPhone) {
      newErrors.driverPhone =
        "Le numéro de téléphone de l'ambulancier est requis";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "add") {
        const response = await ambulanceService.addAmbulance(formData);
        if (typeof onSubmit === "function") {
          onSubmit(response.data);
        }
      } else {
        const response = await ambulanceService.updateAmbulance(
          initialData._id,
          formData
        );
        if (typeof onSubmit === "function") {
          onSubmit(response.data);
        }
      }

      setShowSuccessMessage(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      setServerError(
        error.message || "Une erreur s'est produite lors de l'enregistrement"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderMap = () => (
    <Map
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      mapboxAccessToken={MAPBOX_TOKEN}
      mapStyle={styleOptions[mapStyle]}
      onClick={handleMapClick}
    >
      <Marker
        longitude={formData.location[0]}
        latitude={formData.location[1]}
        anchor="bottom"
      />
      <div className="absolute top-2 left-2 bg-gray-900 bg-opacity-80 rounded-md shadow-md p-1 space-x-1 z-10">
        {Object.keys(styleOptions).map((styleKey) => (
          <button
            key={styleKey}
            type="button"
            onClick={() => setMapStyle(styleKey)}
            className={`px-2 py-1 text-xs rounded ${
              mapStyle === styleKey
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {styleKey.charAt(0).toUpperCase() + styleKey.slice(1)}
          </button>
        ))}
      </div>
    </Map>
  );

  return (
    <div className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-900 shadow-2xl z-50 overflow-y-auto border-l border-gray-800">
      <Card className="p-4 h-full rounded-none flex flex-col bg-gray-900">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h5" className="font-bold text-white">
            {mode === "add" ? "Ajouter une ambulance" : "Modifier l'ambulance"}
          </Typography>
          <IconButton
            variant="text"
            color="gray"
            onClick={handleClose}
            className="rounded-full h-8 w-8 hover:bg-gray-800"
          >
            <XMarkIcon className="h-4 w-4 text-gray-300" />
          </IconButton>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-1">
          {showSuccessMessage && (
            <Alert color="green" className="mb-4">
              {mode === "add"
                ? "Ambulance ajoutée avec succès ! Un email a été envoyé à l'ambulancier."
                : "Ambulance modifiée avec succès !"}
            </Alert>
          )}
          {serverError && (
            <Alert color="red" className="mb-4">
              {serverError}
            </Alert>
          )}

          <div>
            <Typography
              variant="small"
              className="text-gray-300 font-medium mb-1"
            >
              Numéro d'immatriculation *
            </Typography>
            <Input
              size="md"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              error={!!errors.registrationNumber}
              className="rounded-md bg-gray-800 border-gray-700 focus:border-blue-500 text-white"
              labelProps={{ className: "hidden" }}
            />
            {errors.registrationNumber && (
              <Typography color="red" className="mt-1 text-xs">
                {errors.registrationNumber}
              </Typography>
            )}
          </div>

          <div>
            <Typography
              variant="small"
              className="text-gray-300 font-medium mb-1"
            >
              Email de l'ambulancier *
            </Typography>
            <Input
              size="md"
              name="driverEmail"
              type="email"
              value={formData.driverEmail}
              onChange={handleChange}
              error={!!errors.driverEmail}
              className="rounded-md bg-gray-800 border-gray-700 focus:border-blue-500 text-white"
              labelProps={{ className: "hidden" }}
            />
            {errors.driverEmail && (
              <Typography color="red" className="mt-1 text-xs">
                {errors.driverEmail}
              </Typography>
            )}
          </div>

          <div>
            <Typography
              variant="small"
              className="text-gray-300 font-medium mb-1"
            >
              Numéro Tel de l'ambulancier *
            </Typography>
            <div className="flex items-center">
              <span className="px-3 py-2 rounded-l-md bg-gray-700 text-white border border-gray-700 border-r-0">
                +243
              </span>
              <Input
                size="md"
                name="driverPhone"
                type="tel"
                value={formData.driverPhone}
                onChange={handleChange}
                error={!!errors.driverPhone}
                className="rounded-l-none rounded-r-md bg-gray-800 border-gray-700 focus:border-blue-500 text-white w-full"
                labelProps={{ className: "hidden" }}
                placeholder="812345678"
              />
            </div>
            {errors.driverPhone && (
              <Typography color="red" className="mt-1 text-xs">
                {errors.driverPhone}
              </Typography>
            )}
          </div>

          <div>
            <Typography
              variant="small"
              className="text-gray-300 font-medium mb-1"
            >
              Position actuelle
            </Typography>
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div>
                <Input
                  size="md"
                  label="Longitude"
                  value={longitudeInput}
                  onChange={(e) => handleCoordinateChange(e, "longitude")}
                  className="rounded-md bg-gray-800 border-gray-700 focus:border-blue-500 text-white"
                  labelProps={{ className: "text-gray-400" }}
                />
              </div>
              <div>
                <Input
                  size="md"
                  label="Latitude"
                  value={latitudeInput}
                  onChange={(e) => handleCoordinateChange(e, "latitude")}
                  className="rounded-md bg-gray-800 border-gray-700 focus:border-blue-500 text-white"
                  labelProps={{ className: "text-gray-400" }}
                />
              </div>
            </div>
            <div className="h-48 rounded-md overflow-hidden border border-gray-700 relative">
              {renderMap()}
            </div>
          </div>

          <div className="mt-auto pt-2 flex gap-3">
            <Button
              type="button"
              fullWidth
              onClick={handleClose}
              className="rounded-md bg-gray-700 hover:bg-gray-800 text-white py-2.5 text-sm font-medium border border-gray-600"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              fullWidth
              disabled={isSubmitting}
              className="rounded-md bg-blue-600 hover:bg-blue-700 text-white py-2.5 text-sm font-medium"
            >
              {isSubmitting
                ? "Enregistrement..."
                : mode === "add"
                ? "Ajouter"
                : "Enregistrer"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AmbulanceForm;
