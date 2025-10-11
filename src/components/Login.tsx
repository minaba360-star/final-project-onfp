import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "test@mail.com" && password === "1234") {
      alert("Connexion réussie !");
      console.log("Se souvenir de moi :", remember);
      navigate("/"); // Redirige vers le formulaire après login
    } else {
      alert("Email ou mot de passe incorrect !");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-blue-100 p-6">
      <div className="bg-white shadow-2xl rounded-3xl flex flex-col md:flex-row items-center w-full max-w-4xl overflow-hidden">
        
        {/* ---- Formulaire ---- */}
        <div className="w-full md:w-1/2 p-8">
          <div className="flex items-center justify-center mb-6">
            <img
              src="logo.png"
              alt="Logo"
              className="h-20 w-20 rounded-full shadow-md"
            />
          </div>

          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Connexion
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
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
                className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* ✅ Se souvenir de moi */}
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
              className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition font-semibold shadow-md"
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
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-orange-200 to-blue-200 items-center justify-center p-6">
          <img
            src="public/im.png"
          //  alt="Illustration connexion"
            className="rounded-2xl shadow-lg w-3/4 h-3/4 object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
