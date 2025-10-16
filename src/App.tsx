import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FormulaireInscription from "./components/FormulaireInscription";
import Login from "./components/Login";
import DashboardCandidat from "./components/DashboardCandidat";
import DashboardAdmin from "./components/DashboardAdmin";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        
        {/* Page de connexion */}
        <Route path="/login" element={<Login />} />
        
        {/* Page d'inscription */}
        <Route path="/" element={<FormulaireInscription />} />


        {/* Dashboard du candidat */}
        <Route path="/dashboardcandidat" element={<DashboardCandidat />} />

        {/* Dashboard de l’admin */}
        <Route path="/admin" element={<DashboardAdmin />} />

        {/* Page 404 */}
        <Route path="*" element={<div>Page non trouvée</div>} />
      </Routes>
    </Router>
  );
};

export default App;
