import React, { useState, useEffect } from "react";
import {
  Card,
  Input,
  Button,
  Typography,
  Textarea,
  IconButton,
} from "@material-tailwind/react";
import Map, { Marker } from "react-map-gl";
import { MAPBOX_TOKEN } from "../utils/mapboxConfig.js";
import "mapbox-gl/dist/mapbox-gl.css";
import { XMarkIcon } from "@heroicons/react/24/outline";

const styleOptions = {
  standard: "mapbox://styles/steph-24/cm9gwmiai007r01sg1nk5d0pf",
  satellite: "mapbox://styles/steph-24/cm9gx5dk800fg01spb5yq4tet",
};

const HospitalForm = ({
  mode = "add",
  initialData = {},
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    location: initialData?.location?.coordinates || [29.2356, -1.6835], // Coordonnées par défaut centrées sur Goma
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mapStyle, setMapStyle] = useState("standard");
  const [viewState, setViewState] = useState({
    longitude: formData.location[0],
    latitude: formData.location[1],
    zoom: 14,
  });

  const [longitudeInput, setLongitudeInput] = useState(
    formData.location[0].toString()
  );
  const [latitudeInput, setLatitudeInput] = useState(
    formData.location[1].toString()
  );

  useEffect(() => {
    setViewState({
      longitude: formData.location[0],
      latitude: formData.location[1],
      zoom: 14,
    });
    setLongitudeInput(formData.location[0].toString());
    setLatitudeInput(formData.location[1].toString());
  }, [initialData]);

  useEffect(() => {
    setLongitudeInput(formData.location[0].toString());
    setLatitudeInput(formData.location[1].toString());
  }, [formData.location]);

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
        setViewState((prev) => ({
          ...prev,
          longitude: newLongitude,
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
        setViewState((prev) => ({
          ...prev,
          latitude: newLatitude,
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors = {};
    if (!formData.name) newErrors.name = "Le nom est requis";
    if (!formData.email) newErrors.email = "L'email est requis";
    if (!formData.address) newErrors.address = "L'adresse est requise";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-900 shadow-2xl z-50 overflow-y-auto border-l border-gray-800">
      <Card className="p-4 h-full rounded-none flex flex-col bg-gray-900">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h5" className="font-bold text-white">
            {mode === "add" ? "Ajouter un hôpital" : "Modifier l'hôpital"}
          </Typography>
          <IconButton
            variant="text"
            color="gray"
            onClick={onClose}
            className="rounded-full h-8 w-8 hover:bg-gray-800"
          >
            <XMarkIcon className="h-4 w-4 text-gray-300" />
          </IconButton>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-1">
          {/* Nom */}
          <div>
            <Typography
              variant="small"
              className="text-gray-300 font-medium mb-1"
            >
              Nom de l'hôpital *
            </Typography>
            <Input
              size="md"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              className="rounded-md bg-gray-800 border-gray-700 focus:border-blue-500 text-white"
              labelProps={{ className: "hidden" }}
            />
            {errors.name && (
              <Typography color="red" className="mt-1 text-xs">
                {errors.name}
              </Typography>
            )}
          </div>

          {/* Email */}
          <div>
            <Typography
              variant="small"
              className="text-gray-300 font-medium mb-1"
            >
              Email *
            </Typography>
            <Input
              size="md"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              className="rounded-md bg-gray-800 border-gray-700 focus:border-blue-500 text-white"
              labelProps={{ className: "hidden" }}
            />
            {errors.email && (
              <Typography color="red" className="mt-1 text-xs">
                {errors.email}
              </Typography>
            )}
          </div>
          {/* Phon number */}
          <div>
            <Typography
              variant="small"
              className="text-gray-300 font-medium mb-1"
            >
              Numéro Tel *
            </Typography>
            <div className="flex items-center">
              <span className="px-3 py-2 rounded-l-md bg-gray-700 text-white border border-gray-700 border-r-0">
                +243
              </span>
              <Input
                size="md"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                className="rounded-l-none rounded-r-md bg-gray-800 border-gray-700 focus:border-blue-500 text-white w-full"
                labelProps={{ className: "hidden" }}
                placeholder="812345678"
              />
            </div>
            {errors.phone && (
              <Typography color="red" className="mt-1 text-xs">
                {errors.phone}
              </Typography>
            )}
          </div>

          {/* Adresse */}
          <div>
            <Typography
              variant="small"
              className="text-gray-300 font-medium mb-1"
            >
              Adresse complète *
            </Typography>
            <Textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={!!errors.address}
              className="rounded-md bg-gray-800 border-gray-700 focus:border-blue-500 text-white min-h-[80px]"
              labelProps={{ className: "hidden" }}
            />
            {errors.address && (
              <Typography color="red" className="mt-1 text-xs">
                {errors.address}
              </Typography>
            )}
          </div>

          {/* Coordonnées GPS */}
          <div>
            <Typography
              variant="small"
              className="text-gray-300 font-medium mb-1"
            >
              Coordonnées GPS
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
              </Map>
              <div className="absolute top-2 left-2 bg-gray-900 bg-opacity-80 rounded-md shadow-md p-1 space-x-1 z-10">
                {Object.keys(styleOptions).map((styleKey) => (
                  <button
                    key={styleKey}
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
            </div>
            <Typography variant="small" className="text-gray-500 mt-1">
              Cliquez sur la carte pour ajuster la position
            </Typography>
          </div>

          {/* Boutons de soumission */}
          <div className="mt-auto pt-2 flex gap-3">
            <Button
              type="button"
              fullWidth
              onClick={onClose}
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

export default HospitalForm;
