import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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

const API_URL = "http://localhost:3000/candidats";

const DashboardAdmin: React.FC = () => {
  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [specialites, setSpecialites] = useState<string[]>([]);
  const [selectedSpecialite, setSelectedSpecialite] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<{ total: number; parSpecialite: Record<string, number> }>({
    total: 0,
    parSpecialite: {},
  });

  // 🔹 Charger les données depuis le serveur
  const fetchCandidats = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data: Candidat[] = await res.json();
      setCandidats(data);

      // Extraire les spécialités uniques pour le tri
      const uniqueSpecs = Array.from(new Set(data.map((c) => c.specialite))).sort();
      setSpecialites(uniqueSpecs);

      // Calcul statistiques
      const parSpec: Record<string, number> = {};
      data.forEach((c) => {
        parSpec[c.specialite] = (parSpec[c.specialite] || 0) + 1;
      });
      setStats({ total: data.length, parSpecialite: parSpec });
    } catch (err) {
      console.error("Erreur fetch candidats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidats();
  }, []);

  // 🔹 Modifier le statut du candidat
  const handleChangeStatut = async (id: number, newStatut: string) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: newStatut }),
      });
      fetchCandidats();
    } catch (err) {
      console.error("Erreur mise à jour statut:", err);
    }
  };

  // 🔹 Exporter en Excel
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(candidats);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Candidats");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "candidats.xlsx");
  };

  // 🔹 Télécharger un dossier complet du candidat en PDF (fusion symbolique)
  const handleDownloadPDF = (cand: Candidat) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const links = Object.entries(cand.fichiers || {}).filter(([_, url]) => !!url);

    if (links.length === 0) {
      alert("Aucun document disponible pour ce candidat.");
      return;
    }

    links.forEach(([type, url]) => {
      if (url) {
        const link = document.createElement("a");
        link.href = url;
        link.download = `${cand.prenom}_${cand.nom}_${type}.pdf`;
        link.click();
      }
    });
  };

  // 🔹 Filtrer par spécialité
  const filteredCandidats = selectedSpecialite
    ? candidats.filter((c) => c.specialite === selectedSpecialite)
    : candidats;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
        Tableau de bord Administrateur
      </h1>

      {/* 🔍 Filtres et Actions */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <select
          value={selectedSpecialite}
          onChange={(e) => setSelectedSpecialite(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Toutes les spécialités</option>
          {specialites.map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>

        <button
          onClick={fetchCandidats}
          className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-orange-500 transition"
        >
          Rafraîchir
        </button>

        <button
          onClick={handleExportExcel}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          📊 Exporter en Excel
        </button>
      </div>

      {/* 📈 Statistiques */}
      <div className="bg-white shadow rounded-lg p-6 mb-8 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-2">Statistiques générales</h2>
        <p>Total candidatures : <strong>{stats.total}</strong></p>
        <ul className="list-disc list-inside mt-2">
          {Object.entries(stats.parSpecialite).map(([spec, count]) => (
            <li key={spec}>
              {spec} : {count}
            </li>
          ))}
        </ul>
      </div>

      {/* 📋 Liste des candidats */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 shadow bg-white rounded-lg">
          <thead className="bg-blue-100 text-blue-900">
            <tr>
              <th className="border p-2">Nom</th>
              <th className="border p-2">Prénom</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Spécialité</th>
              <th className="border p-2">Niveau</th>
              <th className="border p-2">Statut</th>
              <th className="border p-2">Documents</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center p-4 text-gray-500">
                  Chargement...
                </td>
              </tr>
            ) : filteredCandidats.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center p-4 text-gray-500">
                  Aucun candidat trouvé.
                </td>
              </tr>
            ) : (
              filteredCandidats.map((c) => (
                <tr key={c.id} className="hover:bg-gray-100">
                  <td className="border p-2">{c.nom}</td>
                  <td className="border p-2">{c.prenom}</td>
                  <td className="border p-2">{c.email}</td>
                  <td className="border p-2">{c.specialite}</td>
                  <td className="border p-2">{c.niveau}</td>
                  <td className="border p-2 text-center">
                    <span
                      className={`px-2 py-1 rounded text-white text-sm ${
                        c.statut === "accepte"
                          ? "bg-green-600"
                          : c.statut === "refuse"
                          ? "bg-red-600"
                          : "bg-yellow-500"
                      }`}
                    >
                      {c.statut || "en attente"}
                    </span>
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleDownloadPDF(c)}
                      className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800 text-sm"
                    >
                      📁 Télécharger Dossier
                    </button>
                  </td>
                  <td className="border p-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        className="bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700"
                        onClick={() => handleChangeStatut(c.id, "accepte")}
                      >
                        ✅ Accepter
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                        onClick={() => handleChangeStatut(c.id, "refuse")}
                      >
                        ❌ Refuser
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardAdmin;
