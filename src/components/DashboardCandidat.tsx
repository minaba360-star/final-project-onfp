import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Candidat {
  id: number;
  prenom: string;
  nom: string;
  dateNaissance: string;
  lieuNaissance: string;
  email: string;
  cin: string;
  tel: string;
  adresse: string;
  niveau: string;
  specialite: string;
  experience: number;
  statut?: string;
  fichiers?: {
    cv?: string | null;
    diplome?: string | null;
    lettre?: string | null;
  };
}

const DashboardCandidat: React.FC = () => {
  const navigate = useNavigate();
  const [candidat, setCandidat] = useState<Candidat | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Récupération automatique du candidat connecté
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "candidat") {
      navigate("/login");
      return;
    }

    const userEmail = parsedUser.email;

    const fetchCandidatData = async () => {
      try {
        const response = await fetch("http://localhost:3000/candidats");
        if (!response.ok) throw new Error("Erreur de récupération");

        const data: Candidat[] = await response.json();
        const found = data.find((c) => c.email === userEmail);

        if (found) setCandidat(found);
      } catch (error) {
        console.error("Erreur :", error);
      } finally {
        setLoading(false);
      }
    };

    // Première récupération
    fetchCandidatData();

    // 🔁 Actualisation automatique toutes les 5 secondes
    const interval = setInterval(fetchCandidatData, 5000);

    return () => clearInterval(interval);
  }, [navigate]);

  // 🔹 Déconnexion
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // 🔹 Télécharger un fichier
  const handleDownload = (url: string | null | undefined, filename: string) => {
    if (!url) {
      alert("Aucun fichier disponible !");
      return;
    }

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700">
        Chargement de vos informations...
      </div>
    );
  }

  if (!candidat) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700">
        Candidat non trouvé.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-center text-blue-800">
          Tableau de bord Candidat
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Déconnexion
        </button>
      </div>

      {/* Carte infos */}
      <div className="bg-white p-6 rounded-2xl shadow-md max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Bonjour,{" "}
          <span className="text-blue-700">
            {candidat.prenom} {candidat.nom}
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          <p><strong>Email :</strong> {candidat.email}</p>
          <p><strong>CIN :</strong> {candidat.cin}</p>
          <p><strong>Téléphone :</strong> {candidat.tel}</p>
          <p><strong>Adresse :</strong> {candidat.adresse}</p>
          <p><strong>Date de naissance :</strong> {candidat.dateNaissance}</p>
          <p><strong>Lieu de naissance :</strong> {candidat.lieuNaissance}</p>
          <p><strong>Niveau :</strong> {candidat.niveau}</p>
          <p><strong>Spécialité :</strong> {candidat.specialite}</p>
          <p><strong>Expérience :</strong> {candidat.experience} an(s)</p>
        </div>

        <div className="mt-6 text-center">
          <p className="font-semibold">
            Statut de candidature :
            <span
              className={`ml-2 px-3 py-1 rounded-full text-white ${
                candidat.statut === "accepte"
                  ? "bg-green-600"
                  : candidat.statut === "refuse"
                  ? "bg-red-600"
                  : "bg-yellow-500"
              }`}
            >
              {candidat.statut || "en attente"}
            </span>
          </p>
        </div>

        {/* 🔹 Téléchargement des fichiers */}
        {candidat.fichiers && (
          <div className="mt-8">
            <h3 className="font-semibold text-lg mb-2 text-gray-800">
              Mes documents :
            </h3>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {candidat.fichiers.cv && (
                <button
                  onClick={() =>
                    handleDownload(candidat.fichiers?.cv, "CV.pdf")
                  }
                  className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
                >
                  📄 Télécharger CV
                </button>
              )}
              {candidat.fichiers.diplome && (
                <button
                  onClick={() =>
                    handleDownload(candidat.fichiers?.diplome, "Diplome.pdf")
                  }
                  className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition"
                >
                  🎓 Télécharger Diplôme
                </button>
              )}
              {candidat.fichiers.lettre && (
                <button
                  onClick={() =>
                    handleDownload(candidat.fichiers?.lettre, "Lettre.pdf")
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  ✉️ Télécharger Lettre
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCandidat;
