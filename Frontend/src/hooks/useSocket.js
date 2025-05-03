// src/hooks/useSocket.js
import { useEffect, useState } from 'react';
import socket from "../config/socket";  // ← on importe l’instance unique

const useSocket = () => {
  const [emergency, setEmergency] = useState(null);

  useEffect(() => {
    // On s’abonne uniquement à l’événement newEmergency
    socket.on('newEmergency', data => {
      setEmergency(data);
    });
    return () => {
      socket.off('newEmergency');
    };
  }, []);

  return emergency;
};

export default useSocket;
