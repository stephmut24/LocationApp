import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";

import NavList from "./components/Dashbord/NavList";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Loader from "./components/Loader"; // le spinner qu'on a créé

// Composant principal qui gère le routing + loader
const AppContent = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000); // simule un petit chargement
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {loading && <Loader />}
      <NavList />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

// App "global" qui enveloppe tout dans le Router
const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
