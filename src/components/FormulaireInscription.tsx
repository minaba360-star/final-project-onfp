import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
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
    cvPreview: "",          // 👈 ajout
  diplomePreview: "",     // 👈 ajout
  lettrePreview: "",      // 👈 ajout
  });
// Affichage / masquage des mots de passe
const [showPassword, setShowPassword] = useState<boolean>(false);
const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // 🔹 Convertir un fichier en base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // ✅ Correction : handleChange qui gère input, select et file
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value, files } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [id]: files && files.length > 0 ? files[0] : value,
    }));
  };

  // 🔹 Règle pour mot de passe : 8 caractères minimum, 1 majuscule, 1 chiffre
  const isPasswordValid = (password: string) => {
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  // 🔹 Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérification du mot de passe
    if (!isPasswordValid(formData.password)) {
      Swal.fire({
        icon: "warning",
        title:
          "Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.",
        confirmButtonColor: "#1e3a8a",
      });
      return;
    }

    // Vérification correspondance mot de passe
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Les mots de passe ne correspondent pas !",
        confirmButtonColor: "#1e3a8a",
      });
      return;
    }

    // Vérification que tous les champs sont remplis
    for (const [key, value] of Object.entries(formData)) {
      if (!value) {
        Swal.fire({
          icon: "warning",
          title: `Veuillez remplir le champ : ${key}`,
          confirmButtonColor: "#1e3a8a",
        });
        return;
      }
    }

    try {
      const cv64 = formData.cv ? await fileToBase64(formData.cv) : null;
      const diplome64 = formData.diplome ? await fileToBase64(formData.diplome) : null;
      const lettre64 = formData.lettre ? await fileToBase64(formData.lettre) : null;

      const newCandidat = {
        id: Date.now(),
        prenom: formData.prenom,
        nom: formData.nom,
        dateNaissance: formData.dateNaissance,
        lieuNaissance: formData.lieuNaissance,
        email: formData.email,
        cin: formData.cin,
        tel: formData.tel,
        adresse: formData.adresse,
        password: formData.password,
        niveau: formData.niveau,
        specialite: formData.specialite,
        experience: formData.experience,
        statut: "en_attente",
        fichiers: {
          cv: cv64,
          diplome: diplome64,
          lettre: lettre64,
        },
      };

      const response = await fetch("http://localhost:3000/candidats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCandidat),
      });

      if (!response.ok) throw new Error("Erreur lors de l’enregistrement.");

      Swal.fire({
        icon: "success",
        title: "Candidature enregistrée avec succès !",
        showConfirmButton: false,
        timer: 1800,
      });

      setTimeout(() => navigate("/login"), 1800);
    } catch (error) {
      console.error("Erreur :", error);
      Swal.fire({
        icon: "error",
        title: "Une erreur est survenue pendant l’inscription.",
        confirmButtonColor: "#b91c1c",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* NAVBAR */}
      <header className="bg-orange-500 text-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <a href="/" className="flex items-center space-x-2">
            <img src="logo.png" alt="logo" className="h-10 w-10 rounded-full" />
            <span className="font-bold text-lg">Geustuma</span>
          </a>
          <nav className="space-x-4">
            <Link to="/login">
              <button className="border border-orange-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded">
                Se connecter
              </button>
            </Link>
          </nav>
        </div>
      </header>

      {/* FORMULAIRE */}
      <main className="flex-grow flex items-center justify-center py-10">
        <div className="bg-white shadow-lg rounded-2xl w-full max-w-4xl p-8">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Formulaire d’inscription de candidature
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            encType="multipart/form-data"
          >
           
             {/* Prénom / Nom */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label htmlFor="prenom" className="block text-sm font-medium">Prénom</label> 
             <input id="prenom" type="text" className="w-full border rounded-lg p-2 mt-1" required onChange={handleChange} /> 
             </div> 
             <div> <label htmlFor="nom" className="block text-sm font-medium">Nom</label>
             
             <input id="nom" type="text" className="w-full border rounded-lg p-2 mt-1" required onChange={handleChange} /> 
             </div> 
             </div> 
             {/* Date / Lieu de naissance */} 
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <div>
               <label htmlFor="dateNaissance" className="block text-sm font-medium">Date de naissance</label> 
               <input id="dateNaissance" type="date" className="w-full border rounded-lg p-2 mt-1" required onChange={handleChange} />
                </div> <div> <label htmlFor="lieuNaissance" className="block text-sm font-medium">Lieu de naissance</label> 
                <input id="lieuNaissance" type="text" placeholder="Ville" className="w-full border rounded-lg p-2 mt-1" required onChange={handleChange} />
                 </div>
                  </div>
                   {/* Email / CIN */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <div>
                       <label htmlFor="email" className="block text-sm font-medium">Email</label>
                        <input id="email" type="email" placeholder="exemple@mail.com" className="w-full border rounded-lg p-2 mt-1" required onChange={handleChange} />
                         </div> <div> <label htmlFor="cin" className="block text-sm font-medium">CIN</label> <input id="cin" type="text" className="w-full border rounded-lg p-2 mt-1" required onChange={handleChange} /> 
                         </div> </div> {/* Téléphone / Adresse */} <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label htmlFor="tel" className="block text-sm font-medium">Téléphone</label>
                          <input id="tel" type="tel" placeholder="77 000 00 00" className="w-full border rounded-lg p-2 mt-1" required onChange={handleChange} /> 
                         </div> <div> <label htmlFor="adresse" className="block text-sm font-medium">Adresse</label> <input id="adresse" type="text" className="w-full border rounded-lg p-2 mt-1" required onChange={handleChange} />
                          </div> </div> 
                          {/* Mot de passe / Confirmation */}{/* Mot de passe / Confirmation */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Champ mot de passe */}
  <div>
    <label
      htmlFor="password"
      className="block text-sm font-medium"
    >
      Mot de passe (au moins 8 caractères)
    </label>

    <div className="relative">
      <input
        id="password"
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        className="w-full border rounded-lg p-2 mt-1 pr-10"
        required
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
      >
       {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  </div>

  {/* Champ confirmation */}
  <div>
    <label
      htmlFor="confirmPassword"
      className="block text-sm font-medium"
    >
      Confirmer le mot de passe
    </label>

    <div className="relative">
      <input
        id="confirmPassword"
        type={showConfirmPassword ? "text" : "password"}
        placeholder="••••••••"
        className="w-full border rounded-lg p-2 mt-1 pr-10"
        required
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
      >
          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  </div>
</div>

                             {/* Niveau / Spécialité */}
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <label htmlFor="niveau" className="block text-sm font-medium">
      Niveau d’étude
    </label>
    <select
      id="niveau"
      className="w-full border rounded-lg p-2 mt-1"
      required
      onChange={handleChange}
    >
      <option value="">-- Sélectionnez un niveau --</option>
      <option value="Master">Master</option>
      <option value="Licence">Licence</option>
      <option value="Bac+2">Bac+2</option>
    </select>
  </div>

  <div>
    <label htmlFor="specialite" className="block text-sm font-medium">
      Choisissez votre Spécialité
    </label>
    <select
      id="specialite"
      className="w-full border rounded-lg p-2 mt-1"
      required
      onChange={handleChange} >
      <option value="">-- aucun --</option>
      <option value="Développeur Backend">Développeur Backend</option>
      <option value="Développeur Frontend">Développeur Frontend</option>
      <option value="Administrateur SRI">Administrateur SRI</option>
      <option value="Chef de projet">Chef de projet</option>

    </select>
  </div>
</div>

                            {/* Expérience */} 
                           {/* Fichiers */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">

  {/* === CV === */}
  <div>
    <label className="block text-sm font-medium mb-1">CV</label>
    <input
      id="cv"
      type="file"
      accept=".pdf,.doc,.docx"
      className="hidden"
      required
      onChange={(e) => {
        handleChange(e);
        if (e.target.files && e.target.files[0]) {
          setFormData((prev) => ({
            ...prev,
            cvPreview: URL.createObjectURL(e.target.files[0]),
          }));
        }
      }}
    />
    <label
      htmlFor="cv"
      className="block bg-orange-800 text-white text-center py-2 rounded-lg cursor-pointer hover:bg-blue-500 transition"
    >
      📎 Joindre CV
    </label>

    {/* Affichage du fichier sélectionné */}
    {formData.cv && (
      <div className="mt-2 text-sm text-gray-600">
        <p>📄 {formData.cv.name}</p>
        <a
          href={formData.cvPreview}
          download={formData.cv.name}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Voir / Télécharger
        </a>
      </div>
    )}
  </div>

  {/* === Diplôme === */}
  <div>
    <label className="block text-sm font-medium mb-1">Diplôme</label>
    <input
      id="diplome"
      type="file"
      accept=".pdf,.jpg,.png"
      className="hidden"
      required
      onChange={(e) => {
        handleChange(e);
        if (e.target.files && e.target.files[0]) {
          setFormData((prev) => ({
            ...prev,
            diplomePreview: URL.createObjectURL(e.target.files[0]),
          }));
        }
      }}
    />
    <label
      htmlFor="diplome"
      className="block bg-orange-800 text-white text-center py-2 rounded-lg cursor-pointer hover:bg-blue-500 transition"
    >
      🎓 Joindre Diplôme
    </label>

    {formData.diplome && (
      <div className="mt-2 text-sm text-gray-600">
        <p>📑 {formData.diplome.name}</p>
        <a
          href={formData.diplomePreview}
          download={formData.diplome.name}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Voir / Télécharger
        </a>
      </div>
    )}
  </div>

  {/* === Lettre de motivation === */}
  <div>
    <label className="block text-sm font-medium mb-1">Lettre de motivation</label>
    <input
      id="lettre"
      type="file"
      accept=".pdf,.doc,.docx"
      className="hidden"
      required
     onChange={(e) => {
  handleChange(e);
  if (e.target.files && e.target.files[0]) {
    setFormData((prev) => ({
      ...prev,
      lettrePreview: URL.createObjectURL(e.target.files[0]),
    }));
  }
}}
    />
    <label
      htmlFor="lettre"
      className="block bg-orange-800 text-white text-center py-2 rounded-lg cursor-pointer hover:bg-blue-500 transition"
    >
      ✉️ Joindre Lettre
    </label>

    {formData.lettre && (
      <div className="mt-2 text-sm text-gray-600">
        <p>📝 {formData.lettre.name}</p>
        <a
          href={formData.lettrePreview}
          download={formData.lettre.name}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Voir / Télécharger
        </a>
      </div>
    )}
  </div>

</div>

              {/* Bouton */} <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-blue-500 transition"> S'inscrire </button> 
                              <p className="text-center text-sm text-gray-500 mt-2"> Déjà un compte ?{" "} <Link to="/login" className="text-orange-600 hover:underline"> Se connecter </Link> </p>
              {/* ... */}
          </form>
        </div>
      </main>

      <footer className="bg-orange-500 h-10 mt-10"></footer>
    </div>
  );
};

export default FormulaireInscription;
