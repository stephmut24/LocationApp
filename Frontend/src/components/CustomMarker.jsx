const MARKER_COLORS = {
  hospital: "#e53e3e", // Rouge pour l'hôpital
  ambulance: "#38a169",
  patient: "#4299e1",
};

const createCustomMarker = (type) => {
  const el = document.createElement("div");
  el.className = "custom-marker";

  if (type === "hospital") {
    // Style spécifique pour la croix d'hôpital
    el.style.width = "30px";
    el.style.height = "30px";
    el.style.position = "relative";
    el.style.backgroundColor = "white";
    el.style.borderRadius = "50%";
    el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
    el.style.cursor = "pointer";

    // Créer la croix rouge
    const cross = document.createElement("div");
    cross.style.position = "absolute";
    cross.style.top = "50%";
    cross.style.left = "50%";
    cross.style.transform = "translate(-50%, -50%)";
    cross.style.width = "20px";
    cross.style.height = "20px";
    cross.innerHTML = `
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path
          d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2z"
          fill="#e53e3e"
        />
        <path
          d="M8 12h8M12 8v8"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    `;

    el.appendChild(cross);
  } else {
    // Style par défaut pour les autres types de marqueurs
    el.style.width = "30px";
    el.style.height = "30px";
    el.style.backgroundColor = MARKER_COLORS[type] || "#718096";
    el.style.borderRadius = "50%";
    el.style.border = "2px solid white";
    el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
    el.style.cursor = "pointer";

    // Conserver le code existant pour les autres types de marqueurs
    // ...existing code for other marker types...
  }

  return el;
};

export { createCustomMarker, MARKER_COLORS };
