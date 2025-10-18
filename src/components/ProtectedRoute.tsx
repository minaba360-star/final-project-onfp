import React, { useEffect, useState, type JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole?: "admin" | "candidat";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const location = useLocation();
  const [user, setUser] = useState<{ role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const parsed = JSON.parse(stored) as { role?: string } | null;
      if (!parsed || !parsed.role) {
        setUser(null);
      } else {
        setUser({ role: parsed.role });
        if (requiredRole && parsed.role !== requiredRole) {
          setAccessDenied(true);
        }
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [requiredRole]);

  if (loading) return <p className="text-center mt-4">Chargement...</p>;

  if (!user || accessDenied) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;

