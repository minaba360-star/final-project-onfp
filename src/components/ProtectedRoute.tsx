import React, { useEffect, useState, type JSX } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole?: "admin" | "candidat";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const [user, setUser] = useState<{ role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/user", {
          credentials: "include", // si tu utilises des cookies pour la session
        });
        if (!res.ok) {
          throw new Error("Utilisateur non connecté");
        }
        const data = await res.json();
        setUser(data);

        // Vérifie le rôle si nécessaire
        if (requiredRole && data.role !== requiredRole) {
          setAccessDenied(true);
        }
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [requiredRole]);

  if (loading) return <p className="text-center mt-4">Chargement...</p>;

  if (!user || accessDenied) {
    alert("🚫 Accès refusé : vous n'avez pas les droits nécessaires.");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
