/**
 * TournamentBracketsPage
 * 
 * Página principal de brackets de un torneo.
 * - Carga los datos del torneo, equipos, usuarios y partidos.
 * - Muestra el bracket visual, la tabla de equipos, los partidos jugados y los detalles del torneo.
 * - Permite editar o eliminar el torneo si el usuario tiene permisos.
 * - Al eliminar el torneo, elimina también todos los equipos inscritos.
 */

import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Swal from "sweetalert2";
import { teamService } from "../services/teamService";
import { useTeams } from "../hooks/useTeams";
import { useEffect, useState } from "react";
import { tournamentService } from "../services/tournamentService";
import { userService } from "../services/userServices";
import TournamentDetail from "../Componentes/BracketsComponentes/TournamentDetail";
import TournamentBrackets from "../Componentes/BracketsComponentes/TournamanetTeamBrackets";
import BracketResultsManager from "../Componentes/BracketsComponentes/BracketResultsManager";
import { useMatches } from "../hooks/useMatches";
import MatchesTable from "../Componentes/BracketsComponentes/MatchesTable";
import type { Tournament } from "../types/tournament";
import type { User } from "../types/user";
import Navegacion from "../Componentes/Navegacion";

export default function TournamentBracketsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const { teams } = useTeams(id);
  const {
    matches,
    loading: matchesLoading,
    error: matchesError,
    createMatch,
    updateMatch,
  } = useMatches();

  // Carga los datos del torneo y los usuarios al montar o cambiar el id
  useEffect(() => {
    if (id) tournamentService.getById(id).then(setTournament);
    userService.getAll().then(setUsers);
  }, [id]);

  // Muestra mensaje de carga si el torneo no está listo
  if (!tournament) return <div>Cargando...</div>;

  // Filtra los partidos del torneo actual
  const tournamentMatches = matches.filter((m) => m.tournamentId === tournament.id);
  // Comprueba si el usuario está inscrito como capitán
  const isUserJoined = teams.some((team) => team.captainId === user?.id);
  // Permisos de gestión (admin o dueño)
  const canManage = !!(user && (user.role === "admin" || user.id === tournament.ownerId));

  /**
   * Navega a la página de edición del torneo.
   */
  const handleEditTournament = () => {
    navigate(`/edit-tournament/${tournament.id}`);
  };

  /**
   * Elimina el torneo y todos sus equipos inscritos.
   * - Muestra confirmación antes de eliminar.
   * - Si hay error, muestra alerta.
   */
  const handleDeleteTournament = async () => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esto eliminará el torneo y todos sus equipos inscritos.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      const equiposDelTorneo = teams.filter((team) => team.tournamentId === tournament.id);
      await Promise.all(equiposDelTorneo.map((team) => teamService.delete(team.id)));
      await tournamentService.delete(String(tournament.id));
      await Swal.fire({
        icon: "success",
        title: "Torneo eliminado",
        text: "El torneo y sus equipos han sido eliminados.",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/");
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar el torneo.",
      });
    }
  };

  // Render principal: bracket, equipos, partidos y detalles del torneo
  return (
    <>
      <Navegacion />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
          onClick={() => navigate(-1)}
        >
          ← Volver
        </button>
        {/* Bracket visual y gestión de resultados */}
        <BracketResultsManager
          teams={teams}
          tournamentOwnerId={tournament.ownerId}
          tournamentId={tournament.id}
          matches={tournamentMatches}
          createMatch={createMatch}
          updateMatch={updateMatch}
          matchesError={matchesError}
          matchesLoading={matchesLoading}
        />

        {/* Tabla de equipos inscritos */}
        <TournamentBrackets
          teams={teams}
          users={users}
          tournamentOwnerId={tournament.ownerId}
        />

        {/* Historial de partidos */}
        <div className="mt-8">
          <MatchesTable
            matches={tournamentMatches}
            loading={matchesLoading}
            error={matchesError}
          />
        </div>

        {/* Detalles del torneo y acciones de gestión */}
        <TournamentDetail
          tournament={tournament}
          teams={teams}
          canEdit={canManage}
          canDelete={canManage}
          canJoin={false}
          isUserJoined={isUserJoined}
          onEdit={handleEditTournament}
          onDelete={handleDeleteTournament}
          showViewButton={false}
          showBracketsButton={false}
        />
      </div>
    </>
  );
}