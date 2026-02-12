import type { Tournament } from "../types/tournament";
import type { Team } from "../types/team";
import { getTournamentStatus } from "../utils/getTournamentStatus";

const statusMap: Record<string, string> = {
  open: "Abierto",
  closed: "Cerrado",
  finished: "Finalizado",
  inprogress: "En curso",
};

const statusColorMap: Record<string, string> = {
  open: "bg-green-200 text-green-800",
  closed: "bg-red-200 text-red-800",
  finished: "bg-gray-200 text-gray-800",
  inprogress: "bg-blue-200 text-blue-800",
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

interface Props {
  tournament: Tournament;
  teams: Team[];
  canEdit?: boolean;
  canDelete?: boolean;
  canJoin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onJoin?: () => void;
  showViewButton?: boolean;
  showBracketsButton?: boolean;
  isUserJoined?: boolean;
}

export default function TournamentDetail({
  tournament,
  teams,
  canEdit,
  canDelete,
  canJoin,
  onEdit,
  onDelete,
  onJoin,
  isUserJoined,
}: Props) {
  const progress = Math.min(
    100,
    Math.round(((teams?.length || 0) / tournament.maxTeams) * 100)
  );
  const status = getTournamentStatus(tournament, teams);

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold">{tournament.name}</h1>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColorMap[status]}`}
        >
          {statusMap[status]}
        </span>
      </div>
      <p className="text-gray-600 mb-4">
        Deporte: <span className="font-semibold">{tournament.sport}</span> ·
        Nivel: <span className="font-semibold">{tournament.category}</span>
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
        <h3 className="font-semibold mb-2">Equipos inscritos</h3>
        <ul className="list-disc ml-6 text-gray-700">
          {teams.map(team => (
            <li key={team.id}>
              <span className="font-bold">{team.name}</span>
              {team.players.length > 0 && (
                <>: {team.players.join(", ")}</>
              )}
            </li>
          ))}
          {teams.length === 0 && <li className="text-gray-400">Aún no hay equipos inscritos.</li>}
        </ul>
      </div>

      <div className="flex gap-3 mt-6">
        {canJoin && (
          isUserJoined ? (
            <span className="px-5 py-2 rounded font-semibold bg-gray-200 text-gray-600 cursor-not-allowed">
              Ya te has unido
            </span>
          ) : (
            <button
              disabled={status === "inprogress"}
              onClick={onJoin}
              className={`px-5 py-2 rounded font-semibold transition-colors ${
                status === "inprogress"
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
              }`}
            >
              Unirse
            </button>
          )
        )}

        {canEdit && (
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
          >
            Editar
          </button>
        )}

        {canDelete && (
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
}