import type { Match } from "../types/match";
import type { Team } from "../types/team";

interface Props {
  matches: Match[];
  team?: Team;
  userId?: string | number;
  limit?: number;
}

export default function TeamHistory({ matches, team, userId, limit = 20 }: Props) {
  // Filtra partidos por equipo o usuario
  let filtered = matches;
  if (team) {
    filtered = matches.filter(
      m => m.teamAId === team.id || m.teamBId === team.id
    );
  }
  if (userId) {
    filtered = matches.filter(
      m => m.captainAId === userId || m.captainBId === userId
    );
  }

  // Ordena por fecha descendente y limita a los últimos 20
  const lastMatches = filtered
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Historial de partidos</h2>
      {lastMatches.length === 0 ? (
        <div className="text-gray-500">No hay partidos en el historial.</div>
      ) : (
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="text-left px-4 py-2">Fecha</th>
              <th className="text-left px-4 py-2">Equipo A</th>
              <th className="text-left px-4 py-2">Equipo B</th>
              <th className="text-left px-4 py-2">Resultado</th>
            </tr>
          </thead>
          <tbody>
            {lastMatches.map(match => (
              <tr key={match.id} className="border-b">
                <td className="px-4 py-2">{new Date(match.date).toLocaleDateString()}</td>
                <td className="px-4 py-2">{match.teamAName}</td>
                <td className="px-4 py-2">{match.teamBName}</td>
                <td className="px-4 py-2">{match.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}