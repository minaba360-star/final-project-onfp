import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import FormulaireInscription from "./components/FormulaireInscription";
import Login from "./components/Login";
import DashboardCandidat from "./components/DashboardCandidat";
import DashboardAdmin from "./components/DashboardAdmin";
import Recruteur from "./components/Recruteur"; // formulaire recruteur (dashboard)
import Accueil from "./components/Accueil";
import DetailOffre from "./components/DetailOffre";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import DashboardLayout from "./components/DashboardLayout";

// ✅ Page publique Recruteur intermédiaire
const recruteur: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-blue-700">Espace Recruteur</h1>
      <p className="mt-4 text-gray-600 text-center max-w-xl">
        Bienvenue dans l’espace recruteur. Vous pouvez publier des offres d’emploi,
        consulter vos annonces et gérer vos recrutements.
      </p>
      <a
        href="./components/recruteur"
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800"
      >
        Accéder au tableau de bord
      </a>
    </div>
  );
};

// Layout principal : gère Navbar/Footer selon la page
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  // ✅ On cache Navbar & Footer pour toutes les routes dashboard
  const hideNavbarFooter = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!hideNavbarFooter && <Navbar />}
      {children}
      {!hideNavbarFooter && <Footer />}
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Pages publiques */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Accueil />} />
          <Route path="/accueil" element={<Accueil />} />
          <Route path="/inscription" element={<FormulaireInscription />} />
          <Route path="/recruteur" element={<Recruteur />} />
          <Route path="/offre/:id" element={<DetailOffre />} />

          {/* Page publique Recruteur */}
          <Route path="./components/recruteur" element={<Recruteur />} />

          {/* Dashboards */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>
                <DashboardLayout /> {/* Layout interne des dashboards */}
                </div>
              </ProtectedRoute>
            }
          >
            {/* Admin */}
            <Route
              path="admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DashboardAdmin />
                </ProtectedRoute>
              }
            />
            {/* Candidat */}
            <Route
              path="candidat"
              element={
                <ProtectedRoute requiredRole="candidat">
                  <DashboardCandidat />
                </ProtectedRoute>
              }
            />
            {/* Recruteur */}
            <Route
              path="recruteur"
              element={
                <ProtectedRoute requiredRole="recruteur">
                  <Recruteur />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* 404 */}
          <Route path="*" element={<div>Page non trouvée</div>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
