import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FormulaireInscription from "./components/FormulaireInscription";
import Login from "./components/Login";
import DashboardCandidat from "./components/DashboardCandidat";
import DashboardAdmin from "./components/DashboardAdmin";
import Accueil from "./components/Accueil";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        
        {/* Page de connexion */}
        <Route path="/login" element={<Login />} />
        
        {/* Page d'accueil par défaut */}
        <Route path="/" element={<Accueil />} />


        {/* Dashboard du candidat */}
        <Route
          path="/dashboardcandidat"
          element={
            <ProtectedRoute requiredRole="candidat">
              <DashboardCandidat />
            </ProtectedRoute>
          }
        />

        {/* Dashboard de l’admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />

        {/* Page d'inscription */}
        <Route path="/inscription" element={<FormulaireInscription />} />

        {/* Page 404 */}
        <Route path="*" element={<div>Page non trouvée</div>} />

        {/* Page d'accueil */}
        <Route path="/accueil" element={<Accueil />} />

        {/* La Navbar est rendue globalement au-dessus des routes */}
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
