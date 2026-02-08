import { Link } from "react-router-dom";

const NavLinks = () => (
  <div className="flex gap-6">
    <Link to="/" className="hover:text-blue-200">Inicio</Link>
    <Link to="/create" className="hover:text-blue-200">Crear Torneo</Link>
    <Link to="/MyTournaments/id" className="hover:text-blue-200">Mis Torneos</Link>
    <Link to="/MyProfile" className="hover:text-blue-200">Perfil</Link>
  </div>
);

export default NavLinks;