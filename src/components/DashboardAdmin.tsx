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
const API_OFFRES = "http://localhost:3000/offres";

const DashboardAdmin: React.FC = () => {
  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [specialites, setSpecialites] = useState<string[]>([]);
  const [selectedSpecialite, setSelectedSpecialite] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<{ total: number; parSpecialite: Record<string, number> }>({
    total: 0,
    parSpecialite: {},
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [offersCount, setOffersCount] = useState<number | null>(null);

  // Charger les données
  const fetchCandidats = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data: Candidat[] = await res.json();
      setCandidats(data);
      const uniqueSpecs = Array.from(new Set(data.map((c) => c.specialite))).sort();
      setSpecialites(uniqueSpecs);
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

  const fetchOffersCount = async () => {
    try {
      const res = await fetch(API_OFFRES);
      if (!res.ok) {
        setOffersCount(null);
        return;
      }
      const data = await res.json();
      setOffersCount(Array.isArray(data) ? data.length : Number(data.total ?? 0));
    } catch {
      setOffersCount(null);
    }
  };

  useEffect(() => {
    fetchCandidats();
    fetchOffersCount();
  }, []);

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

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(candidats);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Candidats");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer]), "candidats.xlsx");
  };

  const handleExportCurrentPageExcel = () => {
    const start = (currentPage - 1) * pageSize;
    const pageItems = filteredCandidats.slice(start, start + pageSize);
    const worksheet = XLSX.utils.json_to_sheet(pageItems);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Page");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer]), `candidats_page_${currentPage}.xlsx`);
  };

  const handleDownloadPDF = (cand: Candidat) => {
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

  const filteredCandidats = candidats.filter((c) => {
    const matchesSpec = selectedSpecialite ? c.specialite === selectedSpecialite : true;
    const term = searchTerm.trim().toLowerCase();
    if (!term) return matchesSpec;
    const combined = `${c.nom} ${c.prenom} ${c.email} ${c.specialite} ${c.niveau}`.toLowerCase();
    return matchesSpec && combined.includes(term);
  });

  const totalItems = filteredCandidats.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const pageCandidats = filteredCandidats.slice(startIndex, startIndex + pageSize);

  const totalCandidats = candidats.length;
  const totalAcceptes = candidats.filter((c) => c.statut === "accepte").length;
  const totalRejetes = candidats.filter((c) => c.statut === "refuse").length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-blue-50 to-sky-200 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent drop-shadow-lg">
        🧭 Tableau de bord Administrateur
      </h1>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-2xl shadow-lg p-5 flex items-center gap-4 hover:scale-105 transition-transform duration-300">
          <div className="p-3 rounded-full bg-white/30">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V5a4 4 0 00-8 0v6M5 20h14a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <div className="text-sm uppercase tracking-wider">Inscrits</div>
            <div className="text-3xl font-semibold">{stats.total}</div>
            <div className="text-xs opacity-80">Total des candidats</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-300 to-cyan-500 text-white rounded-2xl shadow-lg p-5 flex items-center gap-4 hover:scale-105 transition-transform duration-300">
          <div className="p-3 rounded-full bg-white/30">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6a4 4 0 118 0v6m-5 3h2" />
            </svg>
          </div>
          <div>
            <div className="text-sm uppercase tracking-wider">Offres</div>
            <div className="text-3xl font-semibold">{offersCount ?? "—"}</div>
            <div className="text-xs opacity-80">Récupérées depuis /offres</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-400 to-sky-600 text-white rounded-2xl shadow-lg p-5 flex items-center gap-4 hover:scale-105 transition-transform duration-300">
          <div className="p-3 rounded-full bg-white/30">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17a4 4 0 01-4-4V7a4 4 0 118 0v6a4 4 0 01-4 4z" />
            </svg>
          </div>
          <div>
            <div className="text-sm uppercase tracking-wider">Candidatures</div>
            <div className="text-3xl font-semibold">{totalCandidats}</div>
            <div className="text-sm mt-1">
              <span className="text-green-200 font-medium">✅ {totalAcceptes} acceptées</span> •{" "}
              <span className="text-red-200 font-medium">❌ {totalRejetes} rejetées</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et actions */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8 bg-white/70 backdrop-blur-lg p-4 rounded-2xl shadow max-w-6xl mx-auto">
        <div className="flex gap-3 flex-wrap">
          <button onClick={fetchCandidats} className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg shadow">
            🔄 Rafraîchir
          </button>
          <button onClick={handleExportExcel} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow">
            📊 Exporter tout
          </button>
          <button onClick={handleExportCurrentPageExcel} className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow">
            📄 Exporter page
          </button>
        </div>
        <div className="flex gap-3 flex-wrap items-center">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher..."
            className="border p-2 rounded-lg w-60 focus:ring-2 focus:ring-sky-400 outline-none"
          />
          <select
            value={selectedSpecialite}
            onChange={(e) => setSelectedSpecialite(e.target.value)}
            className="border p-2 rounded-lg"
          >
            <option value="">Toutes les spécialités</option>
            {specialites.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto bg-white/90 rounded-2xl shadow-xl backdrop-blur-sm max-w-6xl mx-auto border border-blue-100">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-100 to-sky-100 text-blue-800">
            <tr>
              {["Nom", "Prénom", "Email", "Spécialité", "Niveau", "Statut", "Documents", "Action"].map((h) => (
                <th key={h} className="p-3 text-left font-semibold border-b border-blue-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="text-center p-6 text-gray-400">Chargement...</td></tr>
            ) : pageCandidats.length === 0 ? (
              <tr><td colSpan={8} className="text-center p-6 text-gray-400">Aucun candidat trouvé.</td></tr>
            ) : (
              pageCandidats.map((c) => (
                <tr key={c.id} className="hover:bg-sky-50 transition">
                  <td className="p-3 border-b">{c.nom}</td>
                  <td className="p-3 border-b">{c.prenom}</td>
                  <td className="p-3 border-b">{c.email}</td>
                  <td className="p-3 border-b">{c.specialite}</td>
                  <td className="p-3 border-b">{c.niveau}</td>
                  <td className="p-3 text-center border-b">
                    <span className={`px-3 py-1 rounded-full text-white text-sm ${
                      c.statut === "accepte"
                        ? "bg-green-500"
                        : c.statut === "refuse"
                        ? "bg-red-500"
                        : "bg-yellow-400 text-gray-900"
                    }`}>
                      {c.statut || "En attente"}
                    </span>
                  </td>
                  <td className="p-3 text-center border-b">
                    <button
                      onClick={() => handleDownloadPDF(c)}
                      className="bg-sky-500 text-white px-3 py-1 rounded-lg hover:bg-sky-600 transition"
                    >
                      📁 Voir fichiers
                    </button>
                  </td>
                  <td className="p-3 text-center border-b">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleChangeStatut(c.id, "accepte")}
                        className="bg-green-500 text-white px-2 py-1 rounded-full hover:bg-green-600"
                      >
                        ✅
                      </button>
                      <button
                        onClick={() => handleChangeStatut(c.id, "refuse")}
                        className="bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600"
                      >
                        ❌
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center max-w-6xl mx-auto mt-6 text-gray-700">
        <div className="text-sm">
          {totalItems === 0
            ? "0 résultat"
            : `Affichage ${startIndex + 1} - ${Math.min(startIndex + pageCandidats.length, totalItems)} sur ${totalItems}`}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 disabled:opacity-50"
          >
            «
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 disabled:opacity-50"
          >
            ‹
          </button>
          <span className="px-3 py-1 bg-white border rounded-lg shadow-sm">
            Page <b>{currentPage}</b> / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 disabled:opacity-50"
          >
            ›
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 disabled:opacity-50"
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
