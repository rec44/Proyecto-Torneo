import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Swal from "sweetalert2";
import { teamService } from "../services/teamService";
import { getTournamentStatus } from "../utils/getTournamentStatus";
import { useTeams } from "../hooks/useTeams";
import { useEffect, useState } from "react";
import { tournamentService } from "../services/tournamentService";
import { userService } from "../services/userServices";
import TournamentDetail from "../Componentes/TournamentDetail";
import TournamentBrackets from "../Componentes/TournamanetTeamBrackets";
import BracketResultsManager from "../Componentes/BracketResultsManager";
import { useMatches } from "../hooks/useMatches";
import MatchesTable from "../Componentes/MatchesTable";
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

  useEffect(() => {
    if (id) tournamentService.getById(id).then(setTournament);
    userService.getAll().then(setUsers);
  }, [id]);

  if (!tournament) return <div>Cargando...</div>;

  const tournamentMatches = matches.filter((m) => m.tournamentId === tournament.id);
  const isUserJoined = teams.some((team) => team.captainId === user?.id);
  const status = getTournamentStatus(tournament, teams);
  const canManage = !!(user && (user.role === "admin" || user.id === tournament.ownerId));

  const handleEditTournament = () => {
    navigate(`/edit-tournament/${tournament.id}`);
  };

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

  return (
    <>
      <Navegacion />
      <div className="max-w-5xl mx-auto px-4 py-8">
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

        <TournamentBrackets
          teams={teams}
          users={users}
          tournamentOwnerId={tournament.ownerId}
        />

        <div className="mt-8">
          <MatchesTable
            matches={tournamentMatches}
            loading={matchesLoading}
            error={matchesError}
          />
        </div>

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