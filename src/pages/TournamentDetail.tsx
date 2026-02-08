import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navegacion from "../Componentes/Navegacion";
import { tournamentService } from "../services/tournamentService";
import { useAuth } from "../hooks/useAuth";
import { useTeams } from "../hooks/useTeams";
import type { Tournament } from "../types/tournament";

const statusMap: Record<Tournament["status"], string> = {
  open: "Abierto",
  closed: "Cerrado",
  finished: "Finalizado",
};

const statusColorMap: Record<Tournament["status"], string> = {
  open: "bg-green-200 text-green-800",
  closed: "bg-red-200 text-red-red-800",
  finished: "bg-gray-200 text-gray-800",
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

export default function TournamentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { teams } = useTeams(tournament?.id);

  // Comprueba si el usuario es capitán de algún equipo en este torneo
  const isUserJoined = teams.some((team) => team.captainId === user?.id);

  const isJoinDisabled = tournament?.status !== "open" || isUserJoined;

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

  const progress = Math.min(
    100,
    Math.round(((teams?.length || 0) / tournament.maxTeams) * 100)
  );

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
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColorMap[tournament.status]}`}
            >
              {statusMap[tournament.status]}
            </span>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h1 className="text-3xl font-bold mb-2">{tournament.name}</h1>
            <p className="text-gray-600 mb-4">
              Deporte: <span className="font-semibold">{tournament.sport}</span> ·
              Categoría: <span className="font-semibold">{tournament.category}</span>
            </p>
            <p className="text-gray-600 mb-2">
              Provincia: <span className="font-semibold">{tournament.province}</span> ·
              Ciudad: <span className="font-semibold">{tournament.city}</span>
            </p>
            <p className="text-gray-600 mb-2">
              Calle: <span className="font-semibold">{tournament.venue}</span>
            </p>
            {tournament.description && (
              <p className="text-gray-700 mb-4">
                <span className="font-semibold">Descripción:</span> {tournament.description}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-gray-700">
                  Inicio: <span className="font-semibold">{formatDate(tournament.startDate)}</span>
                </p>
                <p className="text-gray-700">
                  Fin: <span className="font-semibold">{formatDate(tournament.endDate)}</span>
                </p>
                <p className="text-gray-700">
                  Máx. equipos: <span className="font-semibold">{tournament.maxTeams}</span>
                </p>
                <p className="text-gray-700">
                  Máx. jugadores por equipo:{" "}
                  <span className="font-semibold">{tournament.maxPlayersPerTeam}</span>
                </p>
              </div>

              <div>
                <p className="text-gray-700 mb-2">
                  Equipos inscritos:{" "}
                  <span className="font-semibold">
                    {teams?.length || 0}/{tournament.maxTeams}
                  </span>
                </p>
                <div className="w-full bg-gray-200 rounded h-3 overflow-hidden">
                  <div
                    className="bg-blue-500 h-3"
                    style={{ width: `${progress}%` }}
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                disabled={isJoinDisabled}
                onClick={() => navigate(`/inscribir/${tournament.id}`)}
                className={`px-5 py-2 rounded font-semibold transition-colors ${
                  isJoinDisabled
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                }`}
              >
                {isUserJoined ? "Ya inscrito" : "Unirse"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}