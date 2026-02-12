import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navegacion from "../Componentes/Navegacion";
import { tournamentService } from "../services/tournamentService";
import { teamService } from "../services/teamService";
import { useAuth } from "../hooks/useAuth";
import { getTournamentStatus } from "../utils/getTournamentStatus";
import { useTeams } from "../hooks/useTeams";
import type { Tournament } from "../types/tournament";
import Swal from "sweetalert2";
import TournamentDetail from "../Componentes/TournamentDetail"; // Asegúrate de importar el componente correcto

export default function TournamentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { teams } = useTeams(tournament?.id);

  // Comprueba si el usuario es capitán de algún equipo en este torneo
  const isUserJoined = teams.some((team) => team.captainId === user?.id);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await tournamentService.getById(String(id));
        setTournament(data);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al cargar torneo");
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navegacion />
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <p className="text-gray-700">Cargando torneo...</p>
        </div>
      </>
    );
  }

  if (error || !tournament) {
    return (
      <>
        <Navegacion />
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4">
          <p className="text-red-600">Error: {error ?? "Torneo no encontrado"}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            Volver
          </button>
        </div>
      </>
    );
  }

  const status = getTournamentStatus(tournament, teams);
  const canManage = user && (user.role === "admin" || user.id === tournament.ownerId);

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

    if (result.isConfirmed) {
      try {
        // Borra todos los equipos del torneo
        const equiposDelTorneo = teams.filter((team) => team.tournamentId === tournament.id);
        await Promise.all(
          equiposDelTorneo.map((team) => teamService.delete(team.id))
        );
        // Borra el torneo
        await tournamentService.delete(String(tournament.id));
        await Swal.fire({
          icon: "success",
          title: "Torneo eliminado",
          text: "El torneo y sus equipos han sido eliminados.",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/"); // Redirige a la página principal
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al eliminar torneo");
      }
    }
  };

  return (
    <>
      <Navegacion />
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
            >
              ← Volver
            </button>
          </div>
          <TournamentDetail
            tournament={tournament}
            teams={teams}
            canEdit={!!canManage}
            canDelete={!!canManage}
            canJoin={status === "open" && !isUserJoined}
            isUserJoined={isUserJoined}
            onEdit={handleEditTournament}
            onDelete={handleDeleteTournament}
            onJoin={() => navigate(`/inscribir/${tournament.id}`)}
            showViewButton={true}
          />
        </div>
      </div>
    </>
  );
}