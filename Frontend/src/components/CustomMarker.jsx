import React from "react";
import { Marker } from "mapbox-gl";

const MARKER_COLORS = {
  hospital: "#e53e3e",
  ambulance: "#38a169",
  patient: "#4299e1",
};

const createCustomMarker = (type) => {
  const el = document.createElement("div");
  el.className = "custom-marker";
  el.style.width = "30px";
  el.style.height = "30px";
  el.style.backgroundSize = "cover";

  switch (type) {
    case "hospital":
      el.style.backgroundImage = "url('/icons/hospital.png')";
      break;
    case "ambulance":
      el.style.backgroundImage = "url('/icons/ambulance.png')";
      break;
    case "patient":
      el.style.backgroundImage = "url('/icons/patient.png')";
      break;
    default:
      el.style.backgroundImage = "url('/icons/default.png')";
  }

  return el;
};

export { createCustomMarker, MARKER_COLORS };
