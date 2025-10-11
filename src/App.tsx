import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FormulaireInscription from "./components/FormulaireInscription";
import Login from "./components/Login";
import DashboardCandidat from "./components/DashboardCandidat";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormulaireInscription />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard-candidat"
          element={
            <ProtectedRoute requiredRole="candidat">
              <DashboardCandidat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<div>Page non trouvée</div>} />
      </Routes>
    </Router>
  );
};

export default App;
