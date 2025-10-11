import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Exemple : vérification simplifiée
    if (email === "admin@mail.com" && password === "admin123") {
      localStorage.setItem("role", "admin");
      navigate("/admin"); // Redirection vers dashboard admin
    } else if (email === "candidat@mail.com" && password === "1234") {
      localStorage.setItem("email", email);
      localStorage.setItem("role", "candidat");
      navigate("/dashboard-candidat"); // Redirection vers dashboard candidat
    } else {
      alert("Email ou mot de passe incorrect !");
    }

    console.log("Se souvenir de moi :", remember);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-blue-100 p-4 sm:p-6">
      <div className="bg-white shadow-2xl rounded-2xl flex flex-col md:flex-row items-stretch w-full max-w-3xl overflow-hidden transition-all duration-300">
        
        {/* ---- Formulaire à gauche ---- */}
        <div className="w-full md:w-1/2 p-8 sm:p-10 flex flex-col justify-center">
          <div className="flex items-center justify-center mb-6">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-20 w-20 rounded-full shadow-md object-cover"
            />
          </div>

          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Connexion
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full border border-gray-300 rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                className="w-full border border-gray-300 rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
              />
              <label htmlFor="remember" className="text-sm text-gray-600">
                Se souvenir de moi
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-800 text-white py-2 rounded-lg hover:bg-orange-600 transition font-semibold shadow-md"
            >
              Se connecter
            </button>

            <p className="text-center text-sm text-gray-500">
              Pas encore de compte ?{" "}
              <Link to="/" className="text-blue-600 hover:underline">
                S’inscrire
              </Link>
            </p>
          </form>
        </div>

        {/* ---- Image à droite ---- */}
        <div className="hidden md:flex w-1/2 relative">
          <img
            src="/ima.png" // ⚠️ l’image doit être dans /public
            alt="Illustration de connexion"
            className="absolute inset-0 w-full h-full object-cover brightness-105 contrast-110"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
