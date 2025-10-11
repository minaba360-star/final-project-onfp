import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

let candidatures = []; // Tableau pour stocker les données en mémoire

// ✅ Route POST - Enregistrer une candidature
app.post("/api/candidatures", (req, res) => {
  const candidature = {
    id: candidatures.length + 1,
    prenom: req.body.prenom,
    nom: req.body.nom,
    email: req.body.email,
    password: req.body.password,
    specialite: req.body.specialite,
    niveau: req.body.niveau,
    experience: req.body.experience,
    statut: req.body.statut || "en_attente",
  };

  candidatures.push(candidature);
  console.log("Nouvelle candidature :", candidature);
  res.status(201).json({ message: "Candidature enregistrée", candidature });
});

// ✅ Route GET - Lister toutes les candidatures
app.get("/api/candidatures", (req, res) => {
  res.json(candidatures);
});

// ✅ Route POST - Connexion candidat
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const user = candidatures.find(
    (c) => c.email === email && c.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Email ou mot de passe incorrect" });
  }

  res.json({
    message: "Connexion réussie",
    user: {
      prenom: user.prenom,
      nom: user.nom,
      email: user.email,
      role: "candidat",
    },
  });
});

// Lancer le serveur
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Serveur API démarré sur http://localhost:${PORT}`);
});
