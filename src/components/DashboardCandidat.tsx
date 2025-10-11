import React, { useEffect, useState } from "react";
import axios from "axios";

interface Candidat {
  id: number;
  prenom: string;
  nom: string;
  email: string;
  specialite: string;
  niveau: string;
  experience: number;
  statut: string;
}

const DashboardCandidat: React.FC = () => {
  const [candidat, setCandidat] = useState<Candidat | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("email"); // récupéré à la connexion

    if (!email) {
      console.warn("Aucun email trouvé dans le stockage local !");
      return;
    }

    axios
      .get<Candidat[]>("http://localhost:5000/api/candidatures")
      .then((res) => {
        const found = res.data.find((c) => c.email === email);
        setCandidat(found || null);
      })
      .catch((err) => console.error(err));
  }, []);

  if (!candidat) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">Chargement de votre profil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-700">
          Bienvenue, {candidat.prenom} {candidat.nom}
        </h1>

        <div className="space-y-2">
          <p><strong>Email :</strong> {candidat.email}</p>
          <p><strong>Spécialité :</strong> {candidat.specialite}</p>
          <p><strong>Niveau :</strong> {candidat.niveau}</p>
          <p><strong>Expérience :</strong> {candidat.experience} ans</p>
          <p><strong>Statut :</strong> {candidat.statut}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCandidat;
