import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { MAPBOX_TOKEN } from "../utils/mapboxConfig";
import hospitalService from "../Services/hopitalService";
import { createCustomMarker } from "./CustomMarker";
import { useAuth } from "../context/AuthContext";

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
  const { user } = useAuth(); // Récupérer l'utilisateur depuis le localStorage
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
        if (user?.role === "hospital") {
          const response = await hospitalService.getHospitals();
          console.log("Données brutes reçues:", response);

          // Vérifier la structure de la réponse
          const ambulances = response?.data?.data || [];
          console.log("Ambulances extraites:", ambulances);

          setLocations((prev) => ({
            ...prev,
            ambulances: Array.isArray(ambulances) ? ambulances : [],
          }));
        } else {
          const response = await hospitalService.getHospitals();
          setLocations((prev) => ({
            ...prev,
            hospitals: response?.data?.data || [],
          }));
        }
      } catch (error) {
        console.error("Erreur chargement données:", error);
        // Réinitialiser les locations en cas d'erreur
        setLocations({
          hospitals: [],
          ambulances: [],
          patients: [],
        });
      }
    };

    fetchLocations();
    const interval = setInterval(fetchLocations, 300000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (user?.role === "hospital" && Array.isArray(locations.ambulances)) {
      // Affichage des ambulances pour l'hôpital
      console.log("Ambulances à afficher:", locations.ambulances);
      locations.ambulances.forEach((ambulance) => {
        if (!ambulance || !ambulance.location) {
          console.warn("Ambulance invalide:", ambulance);
          return;
        }

        const coordinates = ambulance.location?.coordinates;
        if (!validateCoordinates(coordinates)) {
          console.warn(
            "Coordonnées invalides pour l'ambulance:",
            ambulance.registrationNumber
          );
          return;
        }

        const marker = new mapboxgl.Marker(createCustomMarker("ambulance"))
          .setLngLat(coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(`
                <div class="p-3">
                  <h3 class="font-bold">${ambulance.registrationNumber}</h3>
                  <p>Chauffeur: ${ambulance.driverEmail}</p>
                  <p>Téléphone: ${ambulance.driverPhone}</p>
                  <p>Status: ${ambulance.status}</p>
                </div>
              `)
          )
          .addTo(mapRef.current);

        markersRef.current.push(marker);
      });
    } else if (user?.role === "admin" && Array.isArray(locations.hospitals)) {
      // Affichage des hôpitaux pour l'admin
      console.log("Hôpitaux à afficher:", locations.hospitals);
      locations.hospitals.forEach((hospital) => {
        if (!hospital || !hospital.location) {
          console.warn("Hôpital invalide:", hospital);
          return;
        }

        const coordinates = hospital.location?.coordinates;
        if (!validateCoordinates(coordinates)) {
          console.warn("Coordonnées invalides pour l'hôpital:", hospital.name);
          return;
        }

        const marker = new mapboxgl.Marker(createCustomMarker("hospital"))
          .setLngLat(coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(`
                <div class="p-3">
                  <h3 class="font-bold">${hospital.name}</h3>
                  <p>${hospital.address}</p>
                  <p>Tél: ${hospital.phone}</p>
                </div>
              `)
          )
          .addTo(mapRef.current);

        markersRef.current.push(marker);
      });
    }
  }, [locations, user]);
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
