import React, { useState, useEffect, type ChangeEvent, useCallback } from "react";
import axios from "axios";
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
  statut: string; // ex: "en_attente", "accepte", "refuse"
}

interface Filter {
  specialite: string;
  date: string;
  diplome: string;
  statut: string;
}

interface Stats {
  total: number;
  parSpecialite: Record<string, number>;
}

const AdminCandidatures: React.FC = () => {
  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [filter, setFilter] = useState<Filter>({ specialite: "", date: "", diplome: "", statut: "" });
  const [stats, setStats] = useState<Stats>({ total: 0, parSpecialite: {} });

  // Récupération des candidatures via l'API
 const fetchCandidats = useCallback(async () => {
  try {
    const res = await axios.get<Candidat[]>("https://ton-api.com/candidatures", { params: filter });
    setCandidats(res.data);

    // Calcul simple des stats
    const parSpecialite: Record<string, number> = {};
    res.data.forEach(c => {
      parSpecialite[c.specialite] = (parSpecialite[c.specialite] || 0) + 1;
    });
    setStats({ total: res.data.length, parSpecialite });
  } catch (err) {
    console.error(err);
  }
}, [filter]); // Add the dependencies of fetchCandidats here

useEffect(() => {
  fetchCandidats();
}, [fetchCandidats]);

  const handleDownload = (id: number) => {
    window.open(`https://ton-api.com/candidatures/${id}/download`, "_blank");
  };

  const handleExportExcel = () => {
    axios
      .get("https://ton-api.com/candidatures/export/excel", { responseType: "blob", params: filter })
      .then(res => saveAs(res.data, "candidatures.xlsx"))
      .catch(err => console.error(err));
  };

  const handleExportPDF = () => {
    axios
      .get("https://ton-api.com/candidatures/export/pdf", { responseType: "blob", params: filter })
      .then(res => saveAs(res.data, "candidatures.pdf"))
      .catch(err => console.error(err));
  };

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setFilter({ ...filter, [name]: value });
};

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Tableau de bord des candidatures</h1>

      {/* Filtres */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input name="specialite" placeholder="Spécialité" className="border p-2 rounded" onChange={handleFilterChange} />
        <input name="date" type="date" className="border p-2 rounded" onChange={handleFilterChange} />
        <input name="diplome" placeholder="Diplôme" className="border p-2 rounded" onChange={handleFilterChange} />
        <select name="statut" className="border p-2 rounded" onChange={handleFilterChange}>
          <option value="">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="accepte">Accepté</option>
          <option value="refuse">Refusé</option>
        </select>
        <button className="bg-blue-800 text-white px-4 py-2 rounded" onClick={fetchCandidats}>Filtrer</button>
      </div>

      {/* Statistiques */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Statistiques</h2>
        <p>Total candidatures : {stats.total}</p>
        <ul>
          {Object.entries(stats.parSpecialite).map(([spec, count]) => (
            <li key={spec}>{spec} : {count}</li>
          ))}
        </ul>
      </div>

      {/* Liste des candidatures */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Nom</th>
              <th className="border p-2">Prénom</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Spécialité</th>
              <th className="border p-2">Niveau</th>
              <th className="border p-2">Expérience</th>
              <th className="border p-2">Statut</th>
              <th className="border p-2">Dossier</th>
            </tr>
          </thead>
          <tbody>
            {candidats.map(c => (
              <tr key={c.id} className="hover:bg-gray-100">
                <td className="border p-2">{c.nom}</td>
                <td className="border p-2">{c.prenom}</td>
                <td className="border p-2">{c.email}</td>
                <td className="border p-2">{c.specialite}</td>
                <td className="border p-2">{c.niveau}</td>
                <td className="border p-2">{c.experience}</td>
                <td className="border p-2">{c.statut}</td>
                <td className="border p-2">
                  <button className="bg-green-600 text-white px-2 py-1 rounded" onClick={() => handleDownload(c.id)}>Télécharger</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Export */}
      <div className="mt-6 flex gap-4">
        <button className="bg-blue-800 text-white px-4 py-2 rounded" onClick={handleExportExcel}>Exporter Excel</button>
        <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={handleExportPDF}>Exporter PDF</button>
      </div>
    </div>
  );
};

export default AdminCandidatures;
