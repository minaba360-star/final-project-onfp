import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const FormulaireInscription: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    dateNaissance: "",
    lieuNaissance: "",
    email: "",
    cin: "",
    tel: "",
    adresse: "",
    password: "",
    confirmPassword: "",
    niveau: "",
    specialite: "",
    experience: "",
    cv: null as File | null,
    diplome: null as File | null,
    lettre: null as File | null,
  });

  // 🔹 Gestion des changements
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: files ? files[0] : value,
    }));
  };

  // 🔹 Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    try {
      const data = new FormData();
      data.append("prenom", formData.prenom);
      data.append("nom", formData.nom);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("specialite", formData.specialite);
      data.append("niveau", formData.niveau);
      data.append("experience", formData.experience);
      data.append("statut", "en_attente");

      // fichiers joints
      if (formData.cv) data.append("cv", formData.cv);
      if (formData.diplome) data.append("diplome", formData.diplome);
      if (formData.lettre) data.append("lettre", formData.lettre);

      await axios.post("http://localhost:5000/api/candidatures", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Candidature enregistrée avec succès !");
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de l’envoi :", error);
      alert("Une erreur est survenue. Vérifie ton serveur !");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* --- NAVBAR --- */}
      <header className="bg-blue-800 text-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <a href="/" className="flex items-center space-x-2">
            <img src="logo.png" alt="logo." className="h-10 w-10 rounded-full" />
            <span className="font-bold text-lg">Geustuma</span>
          </a>

          <nav className="space-x-4">
            <Link to="/login">
              <button className="border border-blue-500 hover:bg-orange-400 text-white font-bold py-2 px-4 rounded">
                Se connecter
              </button>
            </Link>
          </nav>
        </div>
      </header>

      {/* --- FORMULAIRE --- */}
      <main className="flex-grow flex items-center justify-center py-10">
        <div className="bg-white shadow-lg rounded-2xl w-full max-w-4xl p-8">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Formulaire d’inscription de candidature
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            {/* Prénom / Nom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="prenom" className="block text-sm font-medium">Prénom</label>
                <input id="prenom" type="text" className="w-full border rounded-lg p-2 mt-1" required onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="nom" className="block text-sm font-medium">Nom</label>
                <input id="nom" type="text" className="w-full border rounded-lg p-2 mt-1" required onChange={handleChange} />
              </div>
            </div>

            {/* Date / Lieu de naissance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dateNaissance" className="block text-sm font-medium">Date de naissance</label>
                <input id="dateNaissance" type="date" className="w-full border rounded-lg p-2 mt-1" required onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="lieuNaissance" className="block text-sm font-medium">Lieu de naissance</label>
                <input id="lieuNaissance" type="text" placeholder="Ville" className="w-full border rounded-lg p-2 mt-1" required onChange={handleChange} />
              </div>
            </div>

            {/* Email / CIN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                <input id="email" type="email" placeholder="exemple@mail.com" className="w-full border rounded-lg p-2 mt-1" required onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="cin" className="block text-sm font-medium">CIN</label>
                <input id="cin" type="text" className="w-full border rounded-lg p-2 mt-1" required onChange={handleChange} />
              </div>
            </div>

            {/* Téléphone / Adresse */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="tel" className="block text-sm font-medium">Téléphone</label>
                <input id="tel" type="tel" placeholder="77 000 00 00" className="w-full border rounded-lg p-2 mt-1" required onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="adresse" className="block text-sm font-medium">Adresse</label>
                <input id="adresse" type="text" className="w-full border rounded-lg p-2 mt-1" required onChange={handleChange} />
              </div>
            </div>

            {/* Mot de passe / Confirmation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium">Mot de passe</label>
                <input id="password" type="password" placeholder="••••••••" className="w-full border rounded-lg p-2 mt-1" required onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirmer le mot de passe</label>
                <input id="confirmPassword" type="password" placeholder="••••••••" className="w-full border rounded-lg p-2 mt-1" required onChange={handleChange} />
              </div>
            </div>

            {/* Niveau / Spécialité */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="niveau" className="block text-sm font-medium">Niveau d’étude</label>
                <input id="niveau" type="text" className="w-full border rounded-lg p-2 mt-1" required onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="specialite" className="block text-sm font-medium">Spécialité choisie</label>
                <input id="specialite" type="text" className="w-full border rounded-lg p-2 mt-1" required onChange={handleChange} />
              </div>
            </div>

            {/* Expérience */}
            <div>
              <label htmlFor="experience" className="block text-sm font-medium">Années d’expérience</label>
              <input id="experience" type="number" placeholder="Nombre d'années" className="w-full border rounded-lg p-2 mt-1" required onChange={handleChange} />
            </div>

            {/* Fichiers : CV / Diplôme / Lettre */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div>
    <label className="block text-sm font-medium mb-1">CV</label>
    <div className="relative">
      <input id="cv" type="file" accept=".pdf,.doc,.docx" className="hidden" required onChange={handleChange} />
      <label htmlFor="cv" className="block bg-blue-800 text-white text-center py-2 rounded-lg cursor-pointer hover:bg-orange-500 transition">
        📎 Joindre CV
      </label>
    </div>
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">Diplôme</label>
    <div className="relative">
      <input id="diplome" type="file" accept=".pdf,.jpg,.png" className="hidden" required onChange={handleChange} />
      <label htmlFor="diplome" className="block bg-blue-800 text-white text-center py-2 rounded-lg cursor-pointer hover:bg-orange-500 transition">
        🎓 Joindre Diplôme
      </label>
    </div>
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">Lettre de motivation</label>
    <div className="relative">
      <input id="lettre" type="file" accept=".pdf,.doc,.docx" className="hidden" required onChange={handleChange} />
      <label htmlFor="lettre" className="block bg-blue-800 text-white text-center py-2 rounded-lg cursor-pointer hover:bg-orange-500 transition">
        ✉️ Joindre Lettre
      </label>
    </div>
  </div>
</div>


            {/* Bouton */}
            <button type="submit" className="w-full bg-blue-800 text-white py-2 rounded-lg hover:bg-orange-500 transition">
              S'inscrire
            </button>

            <p className="text-center text-sm text-gray-500 mt-2">
              Déjà un compte ?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Se connecter
              </Link>
            </p>
          </form>
        </div>
      </main>

      <footer className="bg-blue-800 h-10 mt-10"></footer>
    </div>
  );
};

export default FormulaireInscription;
