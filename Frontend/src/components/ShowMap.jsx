import React, { useRef, useEffect, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import { MAPBOX_TOKEN } from "../utils/mapboxConfig";
import hospitalService from "../Services/hopitalService";
import ambulanceService from "../Services/ambulanceService";
import emergencyService from "../Services/emergencyService";
import EmergencyAlert from "./EmergencyAlert";
import { createCustomMarker } from "./CustomMarker";
import { useAuth } from "../context/AuthContext";

const MAP_CENTER = [29.2204, -1.6585]; // Goma
const ZOOM_LEVEL = 15;

const styleOptions = {
  standard: "mapbox://styles/steph-24/cm9gwmiai007r01sg1nk5d0pf",
  satellite: "mapbox://styles/steph-24/cm9gx5dk800fg01spb5yq4tet",
  navigation: "mapbox://styles/steph-24/cm9gxab8700fi01rc75f21vlj",
};

const ShowMap = ({ serviceType = "hospital", emergencies }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [mapStyle, setMapStyle] = useState("standard");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { user } = useAuth();

  const [playAlert, setPlayAlert] = useState(false);
  const playAudio = () => {
    const audio = new Audio("/path/to/your/alert-sound.mp3"); // Remplace par le chemin de ton fichier audio
    audio.play();
  };

  // Fonction pour extraire les coordonnées dans différents formats
  const extractCoordinates = (item) => {
    if (!item || !item.location) return null;

    if (
      item.location?.type === "Point" &&
      Array.isArray(item.location?.coordinates)
    ) {
      return item.location.coordinates;
    }

    if (Array.isArray(item.location) && item.location.length === 2) {
      return item.location;
    }

    console.warn("Format de coordonnées non reconnu:", item);
    return null;
  };

  // Fonction de validation des coordonnées
  const validateCoordinates = (coordinates) => {
    if (!coordinates || !Array.isArray(coordinates)) return false;

    const [lng, lat] = coordinates.map(parseFloat);
    return (
      !isNaN(lng) &&
      !isNaN(lat) &&
      lng >= -180 &&
      lng <= 180 &&
      lat >= -90 &&
      lat <= 90
    );
  };

  const fetchAndDisplayData = useCallback(async () => {
    if (!mapRef.current) return;

    try {
      const service =
        serviceType === "hospital"
          ? hospitalService
          : serviceType === "ambulance"
          ? ambulanceService
          : emergencyService;
      const response = await (serviceType === "hospital"
        ? service.getHospitals()
        : serviceType === "ambulance"
        ? service.getAmbulances()
        : service.getEmergencies());

      console.log(`Données reçues (${serviceType}):`, response);

      // Vérifier la validité de la réponse
      if (!response || !response.data) {
        console.warn("Format de réponse invalide:", response);
        return;
      }

      // Nettoyer les marqueurs existants
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      response.data.forEach((item) => {
        const coords = extractCoordinates(item);

        if (!coords) {
          console.warn(
            `Coordonnées manquantes pour: ${item.name || "inconnu"}`
          );
          return;
        }

        if (!validateCoordinates(coords)) {
          console.warn(
            `Coordonnées invalides pour: ${item.name || "inconnu"}`,
            coords
          );
          return;
        }

        console.log(
          `Ajout d'un marqueur (${serviceType}) à:`,
          coords,
          `pour: ${item.name || item.registrationNumber}`
        );

        const marker = new mapboxgl.Marker(createCustomMarker(serviceType))
          .setLngLat(coords)
          .setPopup(
            new mapboxgl.Popup().setHTML(`
               <div class="p-4 min-w-[250px]">
        <h3 class="text-lg font-bold mb-2 text-gray-800 border-b pb-2">
          ${
            serviceType === "hospital"
              ? item.name
              : `Ambulance ${item.registrationNumber}`
          }
        </h3>
        <div class="space-y-2 text-sm">
          ${
            serviceType === "hospital"
              ? `
              <p class="flex items-center text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                ${item.email}
              </p>
              <p class="flex items-center text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                ${item.phone}
              </p>
              <p class="flex items-center text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                ${item.address}
              </p>
            `
              : `
              <p class="flex items-center text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                ${item.phone}
              </p>
              ${
                item.status
                  ? `<p class="flex items-center ${
                      item.status === "available"
                        ? "text-green-600"
                        : "text-red-600"
                    }">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke-width="2"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01"/>
                  </svg>
                  Status: ${item.status}
                </p>`
                  : ""
              }
            `
          }
        </div>
      </div>
            `)
          )
          .addTo(mapRef.current);

        markersRef.current.push(marker);
      });

      console.log(
        `${markersRef.current.length} marqueurs ajoutés pour ${serviceType}`
      );
    } catch (error) {
      console.error(`Erreur chargement ${serviceType}:`, error);
    }
  }, [serviceType]);

  useEffect(() => {
    if (emergencies && emergencies.length > 0) {
      setPlayAlert(true);
    }
  }, [emergencies]);

  useEffect(() => {
    if (playAlert) {
      playAudio(); // Joue l'audio quand playAlert est true
      setPlayAlert(false); // Réinitialise playAlert pour ne pas rejouer l'audio
    }
  }, [playAlert]);
  // Effet pour initialiser la carte
  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: styleOptions[mapStyle],
      center: MAP_CENTER,
      zoom: ZOOM_LEVEL,
    });

    map.on("load", () => {
      mapRef.current = map;
      map.addControl(new mapboxgl.NavigationControl(), "top-right");
      map.addControl(new mapboxgl.FullscreenControl());
      fetchAndDisplayData(); // Charger les données une fois la carte initialisée
    });

    return () => map && map.remove();
  }, [fetchAndDisplayData, mapStyle]);

  // Effet pour recharger les données
  useEffect(() => {
    if (mapRef.current) {
      fetchAndDisplayData();
    }
  }, [fetchAndDisplayData, refreshTrigger, serviceType, user]);

  return (
    <div className="relative w-full h-full">
      <EmergencyAlert play={playAlert} />
      <div ref={mapContainerRef} className="w-full h-full" />
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
        <button
          onClick={() => setRefreshTrigger((prev) => prev + 1)}
          className="px-2 py-1 rounded bg-green-500 text-white ml-2"
        >
          Rafraîchir
        </button>
      </div>
    </div>
  );
};

export default ShowMap;
