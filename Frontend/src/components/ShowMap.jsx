import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { MAPBOX_TOKEN } from "../utils/mapboxConfig";
import { hospitalService } from "../Services/hopitalService";
import { createCustomMarker } from "./CustomMarker";

const MAP_CENTER = [29.2356, -1.6835]; // Goma ?
const ZOOM_LEVEL = 18;

const styleOptions = {
  standard: "mapbox://styles/steph-24/cm9gwmiai007r01sg1nk5d0pf",
  satellite: "mapbox://styles/steph-24/cm9gx5dk800fg01spb5yq4tet",
  navigation: "mapbox://styles/steph-24/cm9gxab8700fi01rc75f21vlj",
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
  }); // Assuming you have a way to set locations

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: styleOptions[mapStyle],
      center: MAP_CENTER,
      zoom: ZOOM_LEVEL,
    });

    mapRef.current = map;

    return () => map.remove();
  }, [mapStyle]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const hospitals = await hospitalService.getHospitals();
        setLocations((prev) => ({
          ...prev,
          hospitals: hospitals.data || [],
        }));
      } catch (error) {
        console.error("Erreur chargement données:", error);
      }
    };

    fetchLocations();
    const interval = setInterval(fetchLocations, 30000);
    return () => clearInterval(interval);
  }, []);

  // Effet pour mettre à jour les marqueurs
  useEffect(() => {
    if (!mapRef.current) return;

    // Supprimer les anciens marqueurs
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    locations.hospitals.forEach((hospital) => {
      const popupContent = `
        <div class="p-3">
          <h3 class="text-lg font-bold text-gray-900 mb-1">${hospital.name}</h3>
          <p class="text-sm text-gray-600">${hospital.address}</p>
          <div class="mt-2 text-sm text-gray-500">
            <p>📞 ${hospital.phone}</p>
            <p>📧 ${hospital.email}</p>
          </div>
        </div>
      `;

      const marker = new mapboxgl.Marker(createCustomMarker("hospital"))
        .setLngLat(hospital.location.coordinates)
        .setPopup(
          new mapboxgl.Popup({
            offset: 25,
            className: "rounded-lg shadow-lg",
          }).setHTML(popupContent)
        )
        .addTo(mapRef.current);

      markersRef.current.push(marker);
    });
  }, [locations]);

  return (
    <div className="relative w-full h-full">
      {/* Carte */}
      <div ref={mapContainerRef} className="w-full h-full" />

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
