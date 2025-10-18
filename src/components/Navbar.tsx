import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const navigate = useNavigate();
  const location = useLocation();

  // Si une ancre est présente dans l'URL, scroller à l'arrivée sur la page d'accueil
  useEffect(() => {
    if (location.pathname === "/" && location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.pathname, location.hash]);

  const goToSection = (sectionId: string) => {
    setIsOpen(false);
    if (location.pathname !== "/") {
      navigate({ pathname: "/", hash: `#${sectionId}` });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="bg-blue-950 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo à gauche */}
          <div className="flex items-center space-x-2 flex-shrink-0">
              <span className="ms-2 fw-bold text-xl text-white font-bold font-serif">JobSpace</span>
          </div>

          {/* Liens à droite sur desktop */}
          <div className="hidden md:flex ml-auto space-x-4">
            <button onClick={() => goToSection("hero")} className="text-white hover:bg-white hover:text-blue-950 px-3 py-2 rounded-md text-sm font-medium border-2 font-serif">Accueil</button>
            <button onClick={() => goToSection("Recruteur")} className="text-white hover:bg-white hover:text-blue-950 px-3 py-2 rounded-md text-sm font-medium border-2 font-serif">Recruteur</button>
            <button onClick={() => navigate("/login")} className="text-white hover:bg-white hover:text-blue-950 px-3 py-2 rounded-md text-sm font-medium border-2 font-serif">Se connecter</button>
            <Link to="/inscription" className="text-blue-950 hover:bg-white hover:text-blue-950 px-3 py-2 rounded-md text-sm font-bold border-2 bg-white font-serif">S'inscrire</Link>
          </div>

          {/* Menu burger mobile */}
          <div className="md:hidden ml-auto">
            <button className="text-gray-300 hover:text-white focus:outline-none" onClick={toggleMenu}>
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isOpen && (
        <div className="md:hidden bg-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button onClick={() => goToSection("hero")} className="block w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium">Accueil</button>
            <button onClick={() => goToSection("Recruteur")} className="block w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium">Recruteur</button>
            <button onClick={() => { setIsOpen(false); navigate("/login"); }} className="block w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium">Se connecter</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
