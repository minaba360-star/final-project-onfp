// server.ts
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Exemple de "base de données" en mémoire
const candidatures = [
  {
    id: 1,
    prenom: "John",
    nom: "Doe",
    email: "john@mail.com",
    specialite: "Informatique",
    niveau: "Licence",
    experience: 2,
    statut: "en_attente"
  }
];

// GET toutes les candidatures avec filtres
app.get("/api/candidatures", (req, res) => {
  const { specialite, statut } = req.query;

  let result = candidatures;

  if (specialite) result = result.filter(c => c.specialite === specialite);
  if (statut) result = result.filter(c => c.statut === statut);

  res.json(result);
});

// GET candidature par ID
app.get("/api/candidatures/:id", (req, res) => {
  const c = candidatures.find(c => c.id === Number(req.params.id));
  if (!c) return res.status(404).json({ error: "Candidat non trouvé" });
  res.json(c);
});

// POST pour ajouter un formulaire
app.post("/api/candidatures", (req, res) => {
  const newCandidat = { id: Date.now(), ...req.body };
  candidatures.push(newCandidat);
  res.status(201).json(newCandidat);
});

// Lancer le serveur
app.listen(5000, () => console.log("API démarrée sur http://localhost:5000"));
