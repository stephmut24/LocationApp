import { Ambulance, Heart, Phone } from "lucide-react";

const Home = () => {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold text-urgence-900 mb-4">
          Assistance médicale d'urgence
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Une réponse rapide et efficace pour sauver des vies
        </p>
        <button className="px-8 py-4 bg-red-500 text-white rounded-lg text-xl font-semibold hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl">
          Signaler une urgence
        </button>
      </section>

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
          description="Suivez le trajet de l'ambulance en direct via WhatsApp"
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
            description="Suivez le trajet de l'ambulance via WhatsApp"
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
