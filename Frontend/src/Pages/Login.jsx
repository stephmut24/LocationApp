import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginError, setLoginError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Login data:", data);
    setLoginError(""); // Réinitialiser les erreurs précédentes

    try {
      // Dans un environnement réel, vous feriez un appel API ici
      // Simulons une vérification d'authentification et récupération du rôle

      // Simulation de la réponse du backend
      let userData;

      // Pour la démo : simulation de différents rôles selon l'email
      if (data.email.includes("admin")) {
        userData = {
          id: "admin_id",
          email: data.email,
          name: "Admin",
          role: "admin",
        };
      } else if (data.email.includes("hospital")) {
        userData = {
          id: "hospital_id",
          email: data.email,
          name: "Hôpital",
          role: "hospital",
        };
      } else if (data.email.includes("ambulance")) {
        userData = {
          id: "ambulance_id",
          email: data.email,
          name: "Ambulance",
          role: "ambulance",
        };
      } else {
        userData = {
          id: "user_id",
          email: data.email,
          name: "Utilisateur",
          role: "utilisateur",
        };
      }

      // Enregistrement des informations de l'utilisateur
      login(userData);

      // Redirection en fonction du rôle retourné par le backend
      if (userData.role === "admin") {
        navigate("/admin");
      } else if (userData.role === "hospital") {
        navigate("/hospital");
      } else if (userData.role === "ambulance") {
        navigate("/ambulance/dashboard");
      } else {
        navigate("/"); // Utilisateur standard
      }
    } catch (error) {
      setLoginError(
        "Erreur d'authentification. Veuillez vérifier vos identifiants."
      );
      console.error("Erreur de connexion:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Heart className="h-12 w-12 text-red-500 animate-pulse" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Connexion à UrgenceCare
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Accédez à votre espace sécurisé
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-xl sm:px-10 border border-gray-100">
          {loginError && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {loginError}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email requis",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Format d'email invalide",
                  },
                })}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="votre@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mot de passe
                </label>
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Mot de passe oublié?
                </a>
              </div>
              <input
                id="password"
                type="password"
                {...register("password", {
                  required: "Mot de passe requis",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 caractères",
                  },
                })}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="rememberMe"
                {...register("rememberMe")}
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-gray-700"
              >
                Se souvenir de moi
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Se connecter
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
