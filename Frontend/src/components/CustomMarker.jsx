import { Hospital, Ambulance } from "lucide-react";
import ReactDOMServer from "react-dom/server";

const MARKER_COLORS = {
  hospital: "#e53e3e", // Rouge pour hôpitaux
  ambulance: "#dd6b20", // Orange pour ambulances
  patient: "#4299e1", // Bleu pour patients
};

const createCustomMarker = (type) => {
  const el = document.createElement("div");
  el.className = `custom-marker custom-marker-${type}`;
  el.style.cursor = "pointer";
  el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";

  // Paramètres communs
  el.style.position = "relative";
  el.style.display = "flex";
  el.style.justifyContent = "center";
  el.style.alignItems = "center";

  if (type === "hospital") {
    el.style.width = "32px";
    el.style.height = "32px";
    // Utiliser l'icône Hospital de Lucide React
    el.innerHTML = ReactDOMServer.renderToString(
      <Hospital size={32} color={MARKER_COLORS.hospital} strokeWidth={2} />
    );
    // Ajouter une classe pour faciliter la sélection CSS
    el.classList.add("hospital-marker");
  } else if (type === "ambulance") {
    el.style.width = "32px";
    el.style.height = "32px";
    // Utiliser l'icône Ambulance de Lucide React avec une taille cohérente
    el.innerHTML = ReactDOMServer.renderToString(
      <Ambulance size={32} color={MARKER_COLORS.ambulance} strokeWidth={2} />
    );
    // Ajouter une classe pour faciliter la sélection CSS
    el.classList.add("ambulance-marker");
  } else {
    // Style pour les patients ou autres types
    el.style.width = "24px";
    el.style.height = "24px";
    el.style.backgroundColor = MARKER_COLORS[type] || "#718096";
    el.style.borderRadius = "50%";
    el.style.border = "2px solid white";
  }

  // Ajouter un effet de pulsation pour améliorer la visibilité
  if (type === "ambulance") {
    // Animation de pulsation pour les ambulances
    el.style.animation = "pulse 1.5s infinite";
  }

  return el;
};

// Style CSS à ajouter dans votre fichier CSS global ou dans le composant ShowMap
// @keyframes pulse {
//   0% { transform: scale(1); opacity: 1; }
//   50% { transform: scale(1.1); opacity: 0.8; }
//   100% { transform: scale(1); opacity: 1; }
// }

export { createCustomMarker, MARKER_COLORS };
