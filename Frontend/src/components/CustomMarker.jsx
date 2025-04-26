import { Hospital, Ambulance } from "lucide-react";
import ReactDOMServer from "react-dom/server";

const MARKER_COLORS = {
  hospital: "#e53e3e",
  ambulance: "#e53e3e",
  patient: "#4299e1",
};

const createCustomMarker = (type) => {
  const el = document.createElement("div");
  el.className = "custom-marker";

  if (type === "hospital") {
    el.style.width = "32px";
    el.style.height = "32px";
    el.style.position = "relative";
    // Utiliser l'icône Hospital de Lucide React
    el.innerHTML = ReactDOMServer.renderToString(
      <Hospital size={32} color={MARKER_COLORS.hospital} strokeWidth={2} />
    );
  } else if (type === "ambulance") {
    el.style.width = "20px";
    el.style.height = "20px";
    el.style.position = "relative";
    // Utiliser l'icône Ambulance de Lucide React
    el.innerHTML = ReactDOMServer.renderToString(
      <Ambulance size={32} color={MARKER_COLORS.ambulance} strokeWidth={2} />
    );
  } else {
    // Style pour les patients (reste inchangé)
    el.style.width = "24px";
    el.style.height = "24px";
    el.style.backgroundColor = MARKER_COLORS[type] || "#718096";
    el.style.borderRadius = "50%";
    el.style.border = "2px solid white";
    el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
  }

  el.style.cursor = "pointer";
  el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";

  return el;
};

export { createCustomMarker, MARKER_COLORS };
