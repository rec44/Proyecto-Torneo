import type { Team } from "../types/team";
import type { User } from "../types/user";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface Props {
  teams: Team[];
  users: User[];
  tournamentOwnerId: string | number;
  onUnregisterTeam?: (teamId: string) => void;
}

export default function TournamentBrackets({
  teams,
  users,
  tournamentOwnerId,
  onUnregisterTeam,
}: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getCaptainName = (captainId: string | number) => {
    const captain = users.find(u => u.id === captainId);
    return captain ? captain.name : "Desconocido";
  };

  const isCreator = user && user.id === tournamentOwnerId;

  // Ordena: tu equipo primero, luego el resto
  const sortedTeams = teams.slice().sort((a, b) => {
    if (user && a.captainId === user.id) return -1;
    if (user && b.captainId === user.id) return 1;
    return 0;
  });

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Equipos del torneo</h2>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="text-left px-4 py-2">Nombre</th>
            <th className="text-left px-4 py-2">Jugadores</th>
            <th className="text-left px-4 py-2">Capitán</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {sortedTeams.map(team => {
            const isMyTeam = user && team.captainId === user.id;
            const isAdmin = user && user.role === "admin";
            return (
              <tr key={team.id} className="border-b">
                <td className="px-4 py-2 font-semibold">{team.name}</td>
                <td className="px-4 py-2 text-gray-600">{team.players.join(", ")}</td>
                <td className="px-4 py-2">{getCaptainName(team.captainId)}</td>
                <td className="px-4 py-2 flex gap-2">
                  {(isCreator || isMyTeam || isAdmin) && (
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                      onClick={() => navigate(`/edit-team/${team.id}`)}
                    >
                      Editar equipo
                    </button>
                  )}
                  {(isMyTeam || isCreator || isAdmin) && (
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      onClick={() => onUnregisterTeam && onUnregisterTeam(team.id)}
                    >
                      Desapuntar equipo
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}