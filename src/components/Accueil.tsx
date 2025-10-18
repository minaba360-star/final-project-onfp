import { useState } from "react"; 
import Hero from "./Hero";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface Offer {
  id: number;
  title: string;
  type: string;
  location: string;
  description: string;
}

  const sampleOffers: Offer[] = [
  { 
    id: 1, 
    title: "Stage Web Dev", 
    type: "Stage", 
    location: "Dakar",
    description: "Stage en développement web pour étudiants en informatique. Missions : création de sites web, intégration front-end, utilisation de React et Tailwind." 
  },
  { 
    id: 2, 
    title: "Emploi Enseignant", 
    type: "Emploi", 
    location: "Thies",
    description: "Poste d'enseignant au lycée régional de Thiès. Profil : Bac+3 minimum, expérience souhaitée en enseignement secondaire." 
  },
  { 
    id: 3, 
    title: "Stage Marketing", 
    type: "Stage", 
    location: "Saint-Louis",
    description: "Stage en marketing digital avec missions de community management, études de marché et création de contenu." 
  },
  { 
    id: 4, 
    title: "Chargé(e) de la Logistique", 
    type: "Emploi", 
    location: "Diourbel",
    description: "Responsable de la gestion des flux logistiques, coordination avec les fournisseurs et suivi des stocks." 
  },
  {
    id: 5,
    title: "Stage de DevOps",
    type: "Stage",
    location: "Dakar",
    description: "Stage en DevOps pour étudiants en informatique. Missions : configuration de environnements, gestion de versioning, automatisation de tâches."
  },
  {
    id: 6,
    title: "Stage de DevOps",
    type: "Stage",
    location: "Dakar",
    description: "Stage en DevOps pour étudiants en informatique. Missions : configuration de environnements, gestion de versioning, automatisation de tâches."
  },
  {
    id: 7,
    title: "Stage de DevOps",
    type: "Stage",
    location: "Dakar",
    description: "Stage en DevOps pour étudiants en informatique. Missions : configuration de environnements, gestion de versioning, automatisation de tâches."
  },
  {
    id: 8,
    title: "Stage de DevOps",
    type: "Stage",
    location: "Dakar",
    description: "Stage en DevOps pour étudiants en informatique. Missions : configuration de environnements, gestion de versioning, automatisation de tâches."
  },
  {
    id: 9,
    title: "Stage de DevOps",
    type: "Stage",
    location: "Dakar",
    description: "Stage en DevOps pour étudiants en informatique. Missions : configuration de environnements, gestion de versioning, automatisation de tâches."
  },
  {
    id: 10,
    title: "Stage de DevOps",
    type: "Stage",
    location: "Dakar",
    description: "Stage en DevOps pour étudiants en informatique. Missions : configuration de environnements, gestion de versioning, automatisation de tâches."
  },
  {
    id: 11,
    title: "Stage de DevOps",
    type: "Stage",
    location: "Dakar",
    description: "Stage en DevOps pour étudiants en informatique. Missions : configuration de environnements, gestion de versioning, automatisation de tâches."
  },
  {
    id: 12,
    title: "Stage de DevOps",
    type: "Stage",
    location: "Dakar",
    description: "Stage en DevOps pour étudiants en informatique. Missions : configuration de environnements, gestion de versioning, automatisation de tâches."
  },
  {
    id: 13,
    title: "Stage de DevOps",
    type: "Stage",
    location: "Dakar",
    description: "Stage en DevOps pour étudiants en informatique. Missions : configuration de environnements, gestion de versioning, automatisation de tâches."
  },
  {
    id: 14,
    title: "Stage de DevOps",
    type: "Stage",
    location: "Dakar",
    description: "Stage en DevOps pour étudiants en informatique. Missions : configuration de environnements, gestion de versioning, automatisation de tâches."
  },
  {
    id: 15,
    title: "Stage de DevOps",
    type: "Stage",
    location: "Dakar",
    description: "Stage en DevOps pour étudiants en informatique. Missions : configuration de environnements, gestion de versioning, automatisation de tâches."
  },
  {
    id: 16,
    title: "Stage de DevOps",
    type: "Stage",
    location: "Dakar",
    description: "Stage en DevOps pour étudiants en informatique. Missions : configuration de environnements, gestion de versioning, automatisation de tâches."
  },
  {
    id: 17,
    title: "Stage de DevOps",
    type: "Stage",
    location: "Dakar",
    description: "Stage en DevOps pour étudiants en informatique. Missions : configuration de environnements, gestion de versioning, automatisation de tâches."
  },
  {
    id: 18,
    title: "Stage de DevOps",
    type: "Stage",
    location: "Dakar",
    description: "Stage en DevOps pour étudiants en informatique. Missions : configuration de environnements, gestion de versioning, automatisation de tâches."
  },
  {
    id: 19,
    title: "Stage de DevOps",
    type: "Stage",
    location: "Dakar",
    description: "Stage en DevOps pour étudiants en informatique. Missions : configuration de environnements, gestion de versioning, automatisation de tâches."
  },
  {
    id: 20,
    title: "Stage de DevOps",
    type: "Stage",
    location: "Dakar",
    description: "Stage en DevOps pour étudiants en informatique. Missions : configuration de environnements, gestion de versioning, automatisation de tâches. "
  },
];

function Accueil() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("Tous");
  const [filterLocation, setFilterLocation] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const navigate = useNavigate();
  const offersPerPage = 6;

  // Localisations uniques
  const locations = ["Tous", ...new Set(sampleOffers.map((o) => o.location))];

  // Filtrage dynamique
  const filteredOffers = sampleOffers.filter((offer) => {
    const matchSearch = offer.title.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "Tous" || offer.type === filterType;
    const matchLocation = filterLocation === "Tous" || offer.location === filterLocation;
    return matchSearch && matchType && matchLocation;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOffers.length / offersPerPage);
  const indexOfLastOffer = currentPage * offersPerPage;
  const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
  const currentOffers = filteredOffers.slice(indexOfFirstOffer, indexOfLastOffer);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  
  return (
    <div className="pt-16">
      {/* Hero / Carousel */}
      <section id="hero">
        <Hero />
      </section>

      {/* Offres */}
      <section id="offers" className="container mx-auto px-4 my-10 space-y-6">
        <h3 className="text-2xl font-bold text-blue-950 mb-4">Offres récentes</h3>

        {/* Filtres */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Rechercher une offre..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded px-3 py-2 flex-1"
          />
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded px-3 py-2"
          >
            <option value="Tous">Tous</option>
            <option value="Stage">Stage</option>
            <option value="Emploi">Emploi</option>
          </select>
          <select
            value={filterLocation}
            onChange={(e) => {
              setFilterLocation(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded px-3 py-2"
          >
            {locations.map((loc, idx) => (
              <option key={idx} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Liste des offres */}
        {currentOffers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {currentOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="border rounded shadow p-4 hover:shadow-lg transition"
                >
                  <h4 className="font-semibold">{offer.title}</h4>
                  <p className="text-sm text-gray-600">
                    {offer.type} - {offer.location}
                  </p>
                  <button
                    onClick={() => setSelectedOffer (offer)} 
                    className="border border-blue-950 text-blue-950 px-2 py-1 rounded hover:bg-blue-950 hover:text-white mt-2 mr-2"
                  >
                    Voir plus
                  </button>
                  <button
                    onClick={() => handleApply(offer, navigate)}
                    className="border border-blue-950 bg-blue-950 text-white px-2 py-1 rounded hover:bg-blue-800 mt-2"
                  >
                    Postuler
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination numérotée */}
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
            onClick={handlePrev}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded border ${
                  currentPage === 1
                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                    : "text-blue-950 border-blue-950 hover:bg-blue-950 hover:text-white"
                }`}
              >
                Précédent
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === num
                      ? "bg-blue-950 text-white border-blue-950"
                      : "text-blue-950 border-blue-950 hover:bg-blue-950 hover:text-white"
                  }`}
                >
                  {num}
                </button>
              ))}

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded border ${
                  currentPage === totalPages
                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                    : "text-blue-950 border-blue-950 hover:bg-blue-950 hover:text-white"
                }`}
              >
                Suivant
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-600 italic">Aucune offre trouvée.</p>
        )}
      </section>

      {/* Modal détails */}
      {selectedOffer && (
        <div className="fixed inset-0 flex items-center justify-center bg-blue-950 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-xl font-bold text-blue-950 mb-2">{selectedOffer?.title}</h3>
            <p className="text-sm text-gray-600 mb-2">
              {selectedOffer?.type} - {selectedOffer?.location}
            </p>
            <p className="mb-4">{selectedOffer?.description}</p>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setSelectedOffer(null)} 
                className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100"
              >
                Fermer
              </button>
              <button
                onClick={() => handleApply(selectedOffer, navigate)}
                className="px-4 py-2 rounded bg-blue-950 text-white hover:bg-blue-950"
              >
                Postuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section À propos */}
       <section id="about" className="bg-gray-50 py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        
        {/* Texte */}
        <div>
          <h2 className="text-3xl md:text-3xl font-bold text-gray-800 mb-6">
            À propos
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Bienvenue sur notre site de recherche d'emploi en Sénégal !
            Notre plateforme connecte les étudiants, jeunes diplômés et professionnels 
            aux meilleures opportunités de stages et d’emplois au Sénégal. 
            Nous croyons que chaque jeune mérite une chance de montrer son potentiel 
            et de contribuer au développement du pays. 
            Nous offrons une large gamme d'offres d'emploi et de stages,
            vous permettant de trouver votre futur emploi ou votre stage de choix.
            Nous sommes fiers de notre engagement envers la qualité de notre offre de stages et d’emplois.
            Notre mission est de fournir des opportunités d'apprentissage et de carriere
            aux jeunes diplômés et professionnels du Sénégal.
          </p>
        </div>

        {/* Image */}
        <div className="flex justify-center">
          <img 
            src="/ima.png" 
            alt="Illustration à propos" 
            className="rounded-2xl shadow-lg w-full max-w-md object-cover"
          />
        </div>
      </div>
    </section>
    {/* Contact */}
    <section id="contact" className="py-10 px-6 md:px-12">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Formulaire de contact */}
        <div className="bg-white border rounded-lg p-6 shadow">
          <h2 className="text-2xl font-bold text-blue-950 mb-4">Nous écrire</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              const nom = String(formData.get("nom") || "");
              const email = String(formData.get("email") || "");
              const message = String(formData.get("message") || "");
              if (!nom || !email || !message) return;
              alert("Merci, votre message a bien été envoyé.");
              form.reset();
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700">Nom</label>
              <input id="nom" name="nom" type="text" required className="mt-1 w-full border rounded px-3 py-2" placeholder="Votre nom" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input id="email" name="email" type="email" required className="mt-1 w-full border rounded px-3 py-2" placeholder="vous@mail.com" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea id="message" name="message" rows={4} required className="mt-1 w-full border rounded px-3 py-2" placeholder="Votre message..."></textarea>
            </div>
            <button type="submit" className="bg-blue-950 text-white px-4 py-2 rounded hover:bg-blue-900">Envoyer</button>
          </form>
        </div>

        {/* Coordonnées */}
        <div className="bg-blue-50 border rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-950 mb-3">Nos coordonnées</h3>
          <ul className="space-y-2 text-gray-700">
            <li><span className="font-medium">Adresse:</span> Dakar, Sénégal</li>
            <li>
              <span className="font-medium">Email:</span> <a className="text-blue-700 underline" href="mailto:support@example.com">support@example.com</a>
            </li>
            <li>
              <span className="font-medium">Téléphone:</span> <a className="text-blue-700" href="tel:+221770000000">+221 77 000 00 00</a>
            </li>
            <li className="text-sm text-gray-500">Du lundi au vendredi, 9h - 18h</li>
          </ul>
        </div>
      </div>
    </section>
    </div>
  );
}

export default Accueil;

// Helpers dans le même fichier pour garder la lisibilité
function handleApply(offer: Offer | null, navigate: any) {
  if (!offer) return;
  const stored = localStorage.getItem("user");
  const parsed = stored ? (JSON.parse(stored) as { role?: string }) : null;

  if (parsed?.role === "candidat") {
    // Déjà connecté en tant que candidat → aller au dashboard
    navigate("/dashboardcandidat");
    return;
  }

  // Demander si l'utilisateur a un compte
  Swal.fire({
    title: "Avez-vous déjà un compte ?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Oui, se connecter",
    cancelButtonText: "Non, s'inscrire",
    confirmButtonColor: "#1e3a8a",
    cancelButtonColor: "#2563eb",
  }).then((result) => {
    if (result.isConfirmed) {
      navigate("/login");
    } else {
      navigate("/inscription");
    }
  });
}
