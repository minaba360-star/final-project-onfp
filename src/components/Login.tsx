import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface Candidat {
  email: string;
  password: string;
  prenom?: string;
  nom?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  React.useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { role?: string };
        if (parsed?.role === "admin" || parsed?.role === "candidat") navigate("/");
      } catch {/* ignore */}
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // --- Vérification si c'est un admin ---
    const adminEmails = ["minaba360@gmail.com", "alinemangane8@gmail.com"];
    const adminPassword = "admin123";

    if (adminEmails.includes(email) && password === adminPassword) {
      const adminUser = { email, role: "admin" };
      localStorage.setItem("user", JSON.stringify(adminUser));

      Swal.fire({
        icon: "success",
        title: "👑 Bienvenue Administrateur !",
        showConfirmButton: false,
        timer: 1800,
      });

      const redirectTo = (location.state as any)?.from?.pathname || "/";
      navigate(redirectTo, { replace: true });
      return;
    }

    try {
      // --- Requête vers ton serveur local ---
      const response = await fetch("http://localhost:3000/candidats");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des candidats.");
      }

      const candidats: Candidat[] = await response.json();

      // 🔹 Recherche du candidat correspondant
      const candidat =
        candidats.find(
          (c) => c.email === email && c.password === password
        ) || null;

      if (candidat) {
        const userData = {
          email: candidat.email,
          role: "candidat",
          prenom: candidat.prenom,
          nom: candidat.nom,
        };

        localStorage.setItem("user", JSON.stringify(userData));

        Swal.fire({
          icon: "success",
          title: `✅ Bienvenue ${candidat.prenom ?? ""} ${candidat.nom ?? ""} !`,
          showConfirmButton: false,
          timer: 2000,
        });

        const redirectTo = (location.state as any)?.from?.pathname || "/";
        navigate(redirectTo, { replace: true });
      } else {
        Swal.fire({
          icon: "error",
          title: "❌ Email ou mot de passe incorrect !",
          showConfirmButton: false,
          timer: 2000,
        });
        setError("Email ou mot de passe incorrect !");
      }
    } catch (err: unknown) {
      console.error("Erreur de connexion :", err);
      Swal.fire({
        icon: "warning",
        title: "⚠️ Impossible de se connecter au serveur local.",
        text: "Vérifie que ton serveur JSON est bien lancé sur le port 3000.",
      });
      setError("Impossible de se connecter au serveur local.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-16">
      {/* --- FORMULAIRE --- */}
      <main className="flex-grow flex items-center justify-center py-10">
        <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">
            Connexion
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@mail.com"
                className="w-full border rounded-lg p-2 mt-1"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border rounded-lg p-2 mt-1"
                required
              />
            </div>

            <div className="flex items-center">
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember" className="text-sm text-gray-600">
                Se souvenir de moi
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-800 text-white py-2 rounded-lg hover:bg-orange-500 transition"
            >
              Se connecter
            </button>

            <p className="text-center text-sm text-gray-500 mt-3">
              Pas encore de compte ?{" "}
              <Link to="/inscription" className="text-blue-800 hover:underline">
                S'inscrire
              </Link>
            </p>
          </form>
        </div>

        
      </main>

      {/* Footer global désormais rendu dans App.tsx */}
    </div>
  );
};

export default Login;
