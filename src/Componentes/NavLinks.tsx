import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const NavLinks = () => {
  const { user } = useAuth();

  return (
    <div className="flex gap-6">
      <Link to="/" className="hover:text-blue-200">Inicio</Link>
      <Link to="/create-tournament" className="hover:text-blue-200">Crear Torneo</Link>
      <Link to="/MyTournaments/id" className="hover:text-blue-200">Mis Torneos</Link>
      <Link to="/MyProfile" className="hover:text-blue-200">Perfil</Link>
      <Link
        to="/admin"
        className="hover:text-yellow-300 font-bold"
        style={{ display: user?.role === "admin" ? "inline" : "none" }}
      >
        Gestión
      </Link>
    </div>
  );
};

export default NavLinks;