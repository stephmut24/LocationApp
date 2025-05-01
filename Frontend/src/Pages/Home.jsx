import { Ambulance, Heart, Phone } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import emergencyService from "../Services/emergencyService";

const Home = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openPhoneDialog, setOpenPhoneDialog] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEmergencyClick = () => {
    setOpenDialog(true);
  };

  const handleConfirmLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setOpenDialog(false);
          setOpenPhoneDialog(true);
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
          alert(
            "Impossible d'obtenir votre position. Veuillez activer la géolocalisation."
          );
        }
      );
    } else {
      alert("Votre navigateur ne supporte pas la géolocalisation.");
    }
  };

  const handlePhoneSubmit = async () => {
    if (phoneNumber && location) {
      setIsLoading(true);
      setError(null);

      try {
        const emergencyData = {
          location,
          phoneNumber,
          timestamp: new Date().toISOString(),
        };

        const response = await emergencyService.createEmergency(emergencyData);
        console.log("Urgence créée:", response);

        setOpenPhoneDialog(false);
        setPhoneNumber("");
        setLocation(null);

        // Optionnel : Afficher un message de succès
        alert(
          "Votre demande d'urgence a été enregistrée. Une ambulance sera bientôt assignée."
        );
      } catch (error) {
        console.error("Erreur lors de la création de l'urgence:", error);
        setError("Une erreur est survenue. Veuillez réessayer.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Veuillez entrer un numéro de téléphone valide");
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold text-urgence-900 mb-4">
          Assistance médicale d'urgence
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Une réponse rapide et efficace pour sauver des vies
        </p>
        <button
          onClick={handleEmergencyClick}
          className="px-8 py-4 bg-red-500 text-white rounded-lg text-xl font-semibold hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
        >
          Signaler une urgence
        </button>
      </section>
      {/* Dialog de confirmation */}
      {/* Dialog de confirmation */}
      <Dialog
        open={openDialog}
        handler={() => setOpenDialog(false)}
        size="xs"
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        className="fixed bg-white rounded-xl shadow-xl w-11/12 max-w-[400px] min-w-[300px] 
    top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] z-50"
      >
        <DialogHeader className="text-red-500 text-center p-4">
          <div className="mx-auto flex items-center justify-center">
            Confirmation d'urgence
          </div>
        </DialogHeader>
        <DialogBody className="p-4">
          <div className="text-center space-y-2">
            <p className="text-gray-700 text-lg">
              Pour vous porter assistance rapidement, nous avons besoin de votre
              position.
            </p>
            <p className="text-gray-600">
              Acceptez-vous de partager votre localisation ?
            </p>
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-center gap-4 p-4">
          <Button
            variant="outlined"
            color="gray"
            onClick={() => setOpenDialog(false)}
            className="flex-1 max-w-[200px]"
          >
            Annuler
          </Button>
          <Button
            variant="filled"
            color="red"
            onClick={handleConfirmLocation}
            className="flex-1 max-w-[200px]"
          >
            Accepter et partager
          </Button>
        </DialogFooter>
      </Dialog>
      {/* Deuxième Dialog pour le numéro de téléphone */}
      <Dialog
        open={openPhoneDialog}
        handler={() => setOpenPhoneDialog(false)}
        size="xs"
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        className="fixed bg-white rounded-xl shadow-xl w-11/12 max-w-[400px] min-w-[300px] 
    top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] z-50"
      >
        <DialogHeader className="text-red-500 text-center p-4">
          <div className="mx-auto flex items-center justify-center">
            <Phone className="h-6 w-6 mr-2" />
            Numéro de contact
          </div>
        </DialogHeader>
        <DialogBody className="p-4">
          <div className="text-center space-y-4">
            {error && <p className="text-red-500 mb-2">{error}</p>}

            <p className="text-gray-700 text-lg">
              Pour pouvoir vous contacter en cas de besoin, veuillez entrer
              votre numéro de téléphone
            </p>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Exemple: 09876543210"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              pattern="[0-9]{10}"
              maxLength="10"
              required
            />
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-center gap-4 p-4">
          <Button
            variant="outlined"
            color="gray"
            onClick={() => {
              setOpenPhoneDialog(false);
              setLocation(null);
            }}
            className="flex-1 max-w-[200px]"
          >
            Annuler
          </Button>
          <Button
            variant="filled"
            color="red"
            onClick={handlePhoneSubmit}
            className="flex-1 max-w-[200px]"
            disabled={isLoading} // Ajout de disabled
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="animate-spin">⌛</span>
                Envoi...
              </div>
            ) : (
              "Confirmer"
            )}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-8 mb-16">
        <FeatureCard
          icon={<Phone size={32} className="text-blue-500" />}
          title="Géolocalisation instantanée"
          description="Partagez votre position en un clic pour une intervention rapide"
        />
        <FeatureCard
          icon={<Ambulance size={32} className="text-red-600" />}
          title="Suivi en temps réel"
          description="Suivez le trajet de l'ambulance en direct via notre application"
        />
        <FeatureCard
          icon={<Heart size={32} className="text-blue-500" />}
          title="Coordination optimale"
          description="Communication fluide entre patients, ambulanciers et hôpitaux"
        />
      </section>

      {/* How it works */}
      <section className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-red-700 mb-8">
          Comment ça marche ?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Step
            number="1"
            title="Signalez l'urgence"
            description="Appuyez sur le bouton d'urgence et acceptez le partage de votre localisation"
          />
          <Step
            number="2"
            title="Ambulance assignée"
            description="Une ambulance est immédiatement envoyée à votre position"
          />
          <Step
            number="3"
            title="Suivi en direct"
            description="Suivez le trajet de l'ambulance via l'application"
          />
        </div>
      </section>
    </main>
  );
};

// Composants internes
const FeatureCard = ({ icon, title, description }) => (
  <article className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-urgence-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </article>
);

const Step = ({ number, title, description }) => (
  <div className="text-center">
    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
      {number}
    </div>
    <h3 className="text-lg font-semibold text-red-600 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Home;
