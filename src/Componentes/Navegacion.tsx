import React from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import NavLinks from "./NavLinks";

const Navegacion: React.FC<{ showLinks?: boolean }> = ({ showLinks = true }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white shadow-lg w-100%">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold">⚽ Torneos</Link>
          {showLinks && <NavLinks />}
          <div className="flex items-center gap-3">
            {user && <span className="text-sm">Bienvenido {user.name}</span>}
            {user ? (
              <button onClick={() => { logout(); navigate("/login"); }} className="bg-white text-blue-600 font-bold py-2 px-4 rounded hover:bg-blue-50">
                Cerrar sesión
              </button>
            ) : (
              <button onClick={() => navigate("/login")} className="bg-white text-blue-600 font-bold py-2 px-4 rounded hover:bg-blue-50">
                Iniciar sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navegacion;