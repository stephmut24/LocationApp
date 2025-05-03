import { Hospital, Ambulance, AlertCircle } from "lucide-react";
import ReactDOMServer from "react-dom/server";

const MARKER_COLORS = {
  hospital: "#e53e3e", // Rouge
  ambulance: "#dd6b20", // Orange
  patient: "#4299e1", // Bleu
  emergency: "#e11d48", // Rouge vif
};

const ICONS = {
  hospital: <Hospital size={16} color="white" strokeWidth={2} />,
  ambulance: <Ambulance size={16} color="white" strokeWidth={2} />,
  emergency: <AlertCircle size={16} color="white" strokeWidth={2} />,
};

const createCustomMarker = (type) => {
  const el = document.createElement("div");
  el.className = `custom-marker custom-marker-${type}`;
  el.style.cursor = "pointer";
  el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";

  // Marqueur rond générique
  el.style.width = "32px";
  el.style.height = "32px";
  el.style.backgroundColor = MARKER_COLORS[type] || "#718096";
  el.style.borderRadius = "50%";
  el.style.border = "2px solid white";
  el.style.display = "flex";
  el.style.justifyContent = "center";
  el.style.alignItems = "center";
  el.style.position = "relative";

  // Ajouter une icône au centre si disponible
  if (ICONS[type]) {
    el.innerHTML = ReactDOMServer.renderToString(ICONS[type]);
  }

  // Animation pulsante pour l'ambulance et l'urgence
  if (type === "ambulance" || type === "emergency") {
    el.style.animation = "pulse 1.5s infinite";
  }

  return el;
};

export { createCustomMarker, MARKER_COLORS };
