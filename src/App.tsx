import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FormulaireInscription from "./components/formulaireInscription";
import Login from "./components/login";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormulaireInscription />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
