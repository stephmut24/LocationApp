import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { MAPBOX_TOKEN } from "../utils/mapboxConfig";
import hospitalService from "../Services/hopitalService";
import { createCustomMarker } from "./CustomMarker";

const MAP_CENTER = [29.2204, -1.6585]; // Goma ?
const ZOOM_LEVEL = 12;

const styleOptions = {
  standard: "mapbox://styles/steph-24/cm9gwmiai007r01sg1nk5d0pf",
  satellite: "mapbox://styles/steph-24/cm9gx5dk800fg01spb5yq4tet",
  navigation: "mapbox://styles/steph-24/cm9gxab8700fi01rc75f21vlj",
};
const validateCoordinates = (coordinates) => {
  return (
    Array.isArray(coordinates) &&
    coordinates.length === 2 &&
    typeof coordinates[0] === "number" &&
    typeof coordinates[1] === "number" &&
    coordinates[0] >= -180 &&
    coordinates[0] <= 180 &&
    coordinates[1] >= -90 &&
    coordinates[1] <= 90
  );
};

const ShowMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [mapStyle, setMapStyle] = useState("standard");
  const [locations, setLocations] = useState({
    hospitals: [],
    ambulances: [],
    patients: [],
  });

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: styleOptions[mapStyle],
      center: MAP_CENTER,
      zoom: ZOOM_LEVEL,
      interactive: true,
    });

    map.on("load", () => {
      console.log("Carte chargée");
      mapRef.current = map;

      map.addControl(new mapboxgl.NavigationControl(), "top-right");
      map.addControl(new mapboxgl.FullscreenControl());

      setLocations((prev) => ({
        ...prev,
      }));
    });

    return () => map && map.remove();
  }, [mapStyle]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // Modifié pour gérer directement la réponse
        const response = await hospitalService.getHospitals();
        console.log("Réponse du service:", response);

        // Adaptez cette ligne selon la structure réelle de votre réponse
        const hospitalData = response.data || response || [];

        setLocations((prev) => ({
          ...prev,
          hospitals: hospitalData,
        }));
      } catch (error) {
        console.error("Erreur chargement données:", error);
      }
    };

    fetchLocations();
    const interval = setInterval(fetchLocations, 30000);
    return () => clearInterval(interval);
  }, []);

  // Ajouter après l'effet qui récupère les données

  // Effet pour mettre à jour les marqueurs
  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    console.log("Total des hôpitaux à ajouter:", locations.hospitals.length);

    locations.hospitals.forEach((hospital) => {
      const coordinates = hospital.location?.coordinates;

      if (!validateCoordinates(coordinates)) {
        console.error(
          `Coordonnées invalides pour ${hospital.name}:`,
          coordinates
        );
        return;
      }

      const [longitude, latitude] = coordinates;
      console.log(
        `Ajout marqueur: ${hospital.name} à [${longitude}, ${latitude}]`
      );

      try {
        const marker = new mapboxgl.Marker(createCustomMarker("hospital"))
          .setLngLat([longitude, latitude])
          .setPopup(
            new mapboxgl.Popup({
              offset: 25,
              className: "rounded-lg shadow-lg",
            }).setHTML(`
              <div class="p-3">
                <h3 class="text-lg font-bold text-gray-900 mb-1">${
                  hospital.name
                }</h3>
                <p class="text-sm text-gray-600">${hospital.address}</p>
                <div class="mt-2 text-sm text-gray-500">
                  <p>📞 ${hospital.phone || "N/A"}</p>
                  <p>📧 ${hospital.email || "N/A"}</p>
                </div>
              </div>
            `)
          )
          .addTo(mapRef.current);

        const pos = marker.getLngLat();
        console.log(`Position réelle du marqueur: [${pos.lng}, ${pos.lat}]`);

        markersRef.current.push(marker);
      } catch (error) {
        console.error(`Erreur marqueur pour ${hospital.name}:`, error);
      }
    });
  }, [locations]);

  return (
    <div className="relative w-full h-full">
      {/* Carte */}
      <div ref={mapContainerRef} className="w-full h-full mao-container" />

      {/* Sélecteur de style */}
      <div className="absolute top-4 left-4 bg-white rounded-md shadow-md p-2 space-x-2 z-10">
        {Object.keys(styleOptions).map((styleKey) => (
          <button
            key={styleKey}
            onClick={() => setMapStyle(styleKey)}
            className={`px-2 py-1 rounded ${
              mapStyle === styleKey ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {styleKey.charAt(0).toUpperCase() + styleKey.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShowMap;
