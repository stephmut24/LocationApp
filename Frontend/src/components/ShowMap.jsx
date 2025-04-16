import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { MAPBOX_TOKEN } from "../utils/mapboxConfig";

const MAP_CENTER = [29.2356, -1.6835]; // Goma ?
const ZOOM_LEVEL = 14;

const styleOptions = {
  standard: "mapbox://styles/steph-24/cm9gwmiai007r01sg1nk5d0pf",
  satellite: "mapbox://styles/steph-24/cm9gx5dk800fg01spb5yq4tet",
  navigation: "mapbox://styles/steph-24/cm9gxab8700fi01rc75f21vlj",
};

const ShowMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  const [mapStyle, setMapStyle] = useState("standard");

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
    if (mapRef.current && styleOptions[mapStyle]) {
      mapRef.current.setStyle(styleOptions[mapStyle]);
    }
  }, [mapStyle]);

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
