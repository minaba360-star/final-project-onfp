import React, { useState } from "react";
import { Link } from "react-router-dom";

const FormulaireInscription: React.FC = () => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    alert("Formulaire soumis avec succès !");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
 <header className="bg-blue-800 text-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <a href="/" className="flex items-center space-x-2">
            <img src="logo.png" alt="logo." className="h-10 w-10 rounded-full" />
            <span className="font-bold text-lg">Geustuma</span></a>
      
   {/* Liens de navig      ation */}
    <nav className="space-x-4">
      <Link 
        to="/login" 
        className=" hover:text-orange-700 font-medium transition "
      >
       <button className="border border-blue-500 hover:bg-orange-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Se connecter</button> 
      </Link>
    </nav>
        </div>
</header>


      {/* Formulaire */}
      <main className="flex-grow flex items-center justify-center py-10">
        <div className="bg-white shadow-lg rounded-2xl w-full max-w-4xl p-8">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Formulaire d’inscription de candidature
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Prénom / Nom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="prenom" className="block text-sm font-medium">Prénom</label>
                <input
                  id="prenom"
                  type="text"
                  className="w-full border rounded-lg p-2 mt-1"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="nom" className="block text-sm font-medium">Nom</label>
                <input
                  id="nom"
                  type="text"
                  className="w-full border rounded-lg p-2 mt-1"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Date / Lieu */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dateNaissance" className="block text-sm font-medium">Date de naissance</label>
                <input
                  id="dateNaissance"
                  type="date"
                  className="w-full border rounded-lg p-2 mt-1"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="lieuNaissance" className="block text-sm font-medium">Lieu de naissance</label>
                <input
                  id="lieuNaissance"
                  type="text"
                  placeholder="Ville"
                  className="w-full border rounded-lg p-2 mt-1"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email / CIN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="exemple@mail.com"
                  className="w-full border rounded-lg p-2 mt-1"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="cin" className="block text-sm font-medium">CIN</label>
                <input
                  id="cin"
                  type="text"
                  className="w-full border rounded-lg p-2 mt-1"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Téléphone / Adresse */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="tel" className="block text-sm font-medium">Tel</label>
                <input
                  id="tel"
                  type="tel"
                  placeholder="Téléphone"
                  className="w-full border rounded-lg p-2 mt-1"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="adresse" className="block text-sm font-medium">Adresse</label>
                <input
                  id="adresse"
                  type="text"
                  className="w-full border rounded-lg p-2 mt-1"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Mot de passe / Confirmation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium">Mot de passe</label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full border rounded-lg p-2 mt-1"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirmez le mot de passe</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="w-full border rounded-lg p-2 mt-1"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Niveau / Spécialité */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="niveau" className="block text-sm font-medium">Niveau étude</label>
                <input
                  id="niveau"
                  type="text"
                  className="w-full border rounded-lg p-2 mt-1"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="specialite" className="block text-sm font-medium">Spécialité choisie</label>
                <input
                  id="specialite"
                  type="text"
                  className="w-full border rounded-lg p-2 mt-1"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Expérience */}
            <div>
              <label htmlFor="experience" className="block text-sm font-medium">Année d’expérience</label>
              <input
                id="experience"
                type="number"
                placeholder="Nombre d'années"
                className="w-full border rounded-lg p-2 mt-1"
                required
                onChange={handleChange}
              />
            </div>

            {/* Fichiers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="cv" className="block text-sm font-medium">CV</label>
                <input id="cv" type="file" className="w-full border rounded-lg p-2 mt-1" required onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="diplome" className="block text-sm font-medium">Diplôme</label>
                <input id="diplome" type="file" className="w-full border rounded-lg p-2 mt-1" required onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="lettre" className="block text-sm font-medium">Lettre de Motivation</label>
                <input id="lettre" type="file" className="w-full border rounded-lg p-2 mt-1" required onChange={handleChange} />
              </div>
            </div>

            {/* Bouton */}
            <button type="submit" 
            className="w-full bg-blue-800 text-white py-2 rounded-lg r hover:bg-orange-500 transition">
              S'inscrire
            </button>

            <p className="text-center text-sm text-gray-500 mt-2">
              Déjà un compte ? <Link to="/login" className="text-blue-600 hover:underline">Se connecter</Link>
            </p>
          </form>
     </div>
      </main>
      <footer className="bg-orange-500 h-10 mt-10"></footer>
    </div>
  );
};
export default FormulaireInscription;