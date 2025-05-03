import { useEffect, useRef } from "react";

const EmergencyAlert = ({ play }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (play && audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.error("Impossible de jouer le son :", err);
      });
    }
  }, [play]);

  return <audio ref={audioRef} src="/sound/son.mp3" preload="auto" />;
};

export default EmergencyAlert;
