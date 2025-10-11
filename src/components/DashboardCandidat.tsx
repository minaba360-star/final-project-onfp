import React, { useEffect, useState } from "react";
import axios from "axios";
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
  statut: string;
  fichiers: {
    cv: string | null;
    diplome: string | null;
    lettre: string | null;
  };
}

const DashboardCandidat: React.FC = () => {
  const navigate = useNavigate();
  const [candidat, setCandidat] = useState<Candidat | null>(null);

  // Récupération des infos du candidat connecté
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");

    if (!userId || role !== "candidat") {
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost:5000/api/candidats/${userId}`)
      .then((res) => setCandidat(res.data))
      .catch((err) => console.error(err));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    navigate("/login");
  };

  if (!candidat) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard Candidat</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Déconnexion
        </button>
      </div>

      <div className="bg-white p-6 rounded shadow-md space-y-4">
        <h2 className="text-xl font-semibold mb-2">
          Bonjour, {candidat.prenom} {candidat.nom}
        </h2>

        <p><strong>Email:</strong> {candidat.email}</p>
        <p><strong>CIN:</strong> {candidat.cin}</p>
        <p><strong>Téléphone:</strong> {candidat.tel}</p>
        <p><strong>Adresse:</strong> {candidat.adresse}</p>
        <p><strong>Date de naissance:</strong> {candidat.dateNaissance}</p>
        <p><strong>Lieu de naissance:</strong> {candidat.lieuNaissance}</p>
        <p><strong>Niveau d'étude:</strong> {candidat.niveau}</p>
        <p><strong>Spécialité:</strong> {candidat.specialite}</p>
        <p><strong>Années d'expérience:</strong> {candidat.experience}</p>
        <p>
          <strong>Statut:</strong>{" "}
          <span className={candidat.statut === "accepte" ? "text-green-600" :
                           candidat.statut === "refuse" ? "text-red-600" : "text-yellow-600"}>
            {candidat.statut}
          </span>
        </p>

        <div className="space-y-2 mt-4">
          <p><strong>Documents:</strong></p>
          {candidat.fichiers.cv && <a className="text-blue-600 hover:underline" href={`http://localhost:5000/uploads/${candidat.fichiers.cv}`} target="_blank" rel="noreferrer">CV</a>}
          {candidat.fichiers.diplome && <a className="text-blue-600 hover:underline" href={`http://localhost:5000/uploads/${candidat.fichiers.diplome}`} target="_blank" rel="noreferrer">Diplôme</a>}
          {candidat.fichiers.lettre && <a className="text-blue-600 hover:underline" href={`http://localhost:5000/uploads/${candidat.fichiers.lettre}`} target="_blank" rel="noreferrer">Lettre de motivation</a>}
        </div>
      </div>
    </div>
  );
};

export default DashboardCandidat;
