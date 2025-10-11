import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardCandidat: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard Candidat</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Déconnexion
        </button>
      </div>

      <p>Bienvenue sur votre tableau de bord !</p>
      {/* Ici tu peux afficher les infos du candidat récupérées via API */}
    </div>
  );
};

export default DashboardCandidat;
