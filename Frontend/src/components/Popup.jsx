// src/components/Popup.jsx
import React from "react";

const Popup = ({ emergency, onClose }) => {
  return (
    <div
      style={popupStyles}
      className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Nouvelle Urgence
        </h2>
        <p>Numéro de téléphone: {emergency.phoneNumber}</p>
        <p>
          Location: Latitude {emergency.location.coordinates[1]}, Longitude{" "}
          {emergency.location.coordinates[0]}
        </p>
        <button
          onClick={onClose}
          className="mt-4 text-white bg-blue-600 px-4 py-2 rounded-md"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

const popupStyles = {
  position: "fixed",
  top: "0",
  left: "0",
  right: "0",
  bottom: "0",
  zIndex: 9999,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)", // Fond semi-transparent
};

export default Popup;
