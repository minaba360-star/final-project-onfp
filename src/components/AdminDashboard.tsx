import React, { useState, useEffect, type ChangeEvent, useCallback } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";

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

interface Filter {
  specialite: string;
  statut: string;
}

interface Stats {
  total: number;
  parSpecialite: Record<string, number>;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [filter, setFilter] = useState<Filter>({ specialite: "", statut: "" });
  const [stats, setStats] = useState<Stats>({ total: 0, parSpecialite: {} });

  // Fonction de récupération
  const fetchCandidats = useCallback(async () => {
    try {
      const res = await axios.get<Candidat[]>(
        "http://localhost:5000/api/candidatures",
        { params: filter }
      );
      setCandidats(res.data);

      const parSpecialite: Record<string, number> = {};
      res.data.forEach((c) => {
        parSpecialite[c.specialite] = (parSpecialite[c.specialite] || 0) + 1;
      });
      setStats({ total: res.data.length, parSpecialite });
    } catch (err) {
      console.error(err);
    }
  }, [filter]);

  // Vérifie le rôle + récupère les données
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/login");
    } else {
      fetchCandidats();
    }
  }, [navigate, fetchCandidats]);

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleExportExcel = () => {
    axios
      .get("http://localhost:5000/api/candidatures/export/excel", {
        responseType: "blob",
        params: filter,
      })
      .then((res) => saveAs(res.data, "candidatures.xlsx"))
      .catch((err) => console.error(err));
  };

  const handleExportPDF = () => {
    axios
      .get("http://localhost:5000/api/candidatures/export/pdf", {
        responseType: "blob",
        params: filter,
      })
      .then((res) => saveAs(res.data, "candidatures.pdf"))
      .catch((err) => console.error(err));
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard Administrateur</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Déconnexion
        </button>
      </div>

      {/* Statistiques */}
      <div className="mb-6 bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-2">Statistiques</h2>
        <p>Total candidatures : {stats.total}</p>
        <ul>
          {Object.entries(stats.parSpecialite).map(([spec, count]) => (
            <li key={spec}>
              {spec} : {count}
            </li>
          ))}
        </ul>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          name="specialite"
          placeholder="Spécialité"
          className="border p-2 rounded"
          onChange={handleFilterChange}
        />
        <select name="statut" className="border p-2 rounded" onChange={handleFilterChange}>
          <option value="">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="accepte">Accepté</option>
          <option value="refuse">Refusé</option>
        </select>
        <button className="bg-blue-800 text-white px-4 py-2 rounded" onClick={fetchCandidats}>
          Filtrer
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white p-4 rounded shadow-md">
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
            </tr>
          </thead>
          <tbody>
            {candidats.map((c) => (
              <tr key={c.id} className="hover:bg-gray-100">
                <td className="border p-2">{c.nom}</td>
                <td className="border p-2">{c.prenom}</td>
                <td className="border p-2">{c.email}</td>
                <td className="border p-2">{c.specialite}</td>
                <td className="border p-2">{c.niveau}</td>
                <td className="border p-2">{c.experience}</td>
                <td className="border p-2">{c.statut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Boutons export */}
      <div className="mt-6 flex gap-4">
        <button className="bg-blue-800 text-white px-4 py-2 rounded" onClick={handleExportExcel}>
          Exporter Excel
        </button>
        <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={handleExportPDF}>
          Exporter PDF
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
