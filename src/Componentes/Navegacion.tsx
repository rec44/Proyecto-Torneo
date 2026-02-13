/**
 * Navegacion
 * 
 * Barra de navegación principal de la aplicación.
 */

import React from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import NavLinks from "./NavLinks";

/**
 * Componente principal de la barra de navegación.
 */
const Navegacion: React.FC<{ showLinks?: boolean }> = ({ showLinks = true }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white shadow-lg w-100%">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo o nombre de la app */}
          <Link to="/" className="text-2xl font-bold">⚽ Torneos</Link>
          {/* Enlaces de navegación principales */}
          {showLinks && <NavLinks />}
          <div className="flex items-center gap-3">
            {/* Mensaje de bienvenida si hay usuario */}
            {user && <span className="text-sm">Bienvenido {user.name}</span>}
            {/* Botón de cerrar sesión o iniciar sesión */}
            {user ? (
              <button
                onClick={() => { logout(); navigate("/login"); }}
                className="bg-white text-blue-600 font-bold py-2 px-4 rounded hover:bg-blue-50"
              >
                Cerrar sesión
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-white text-blue-600 font-bold py-2 px-4 rounded hover:bg-blue-50"
              >
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