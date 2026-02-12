import { useMemo } from "react";
import { useMatches } from "../hooks/useMatches";
import { useTeams } from "../hooks/useTeams";
import { useTournaments } from "../hooks/useTournaments";

interface Props {
  userId: string;
}

export default function UserMatchHistory({ userId }: Props) {
  const { matches, loading, error } = useMatches();
  const { teams } = useTeams();
  const { tournaments } = useTournaments();

  // Encuentra los equipos donde el usuario es jugador o capitán
  const userTeams = teams.filter(
    team =>
      String(team.captainId) === userId ||
      (team.players && team.players.some(p => p === userId))
  );
  const teamIds = userTeams.map(team => String(team.id));

  // Filtra los partidos donde el usuario ha jugado
  const userMatches = useMemo(
    () =>
      matches
        .filter(
          match =>
            teamIds.includes(String(match.homeTeamId)) ||
            teamIds.includes(String(match.visitorTeamId))
        )
        .sort(
          (a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        .slice(0, 20),
    [matches, teamIds]
  );

  // Torneos en los que ha participado
  const tournamentsPlayed = useMemo(() => {
    const ids = new Set(
      userMatches.map(match => match.tournamentId)
    );
    return Array.from(ids);
  }, [userMatches]);

  // Torneos ganados: busca el último partido de cada torneo y mira si su equipo ganó
  const tournamentsWon = useMemo(() => {
    let won = 0;
    tournamentsPlayed.forEach(tournamentId => {
      // Filtra partidos de ese torneo
      const matchesOfTournament = matches
        .filter(m => m.tournamentId === tournamentId)
        .sort((a, b) => b.round - a.round); // Última ronda primero

      if (matchesOfTournament.length === 0) return;

      const finalMatch = matchesOfTournament[0];
      // ¿Ganó el usuario?
      if (
        (teamIds.includes(String(finalMatch.homeTeamId)) && finalMatch.homeScore > finalMatch.visitorScore) ||
        (teamIds.includes(String(finalMatch.visitorTeamId)) && finalMatch.visitorScore > finalMatch.homeScore)
      ) {
        won++;
      }
    });
    return won;
  }, [matches, tournamentsPlayed, teamIds]);

  const rows = useMemo(
    () =>
      userMatches.map(match => {
        const tournament = tournaments.find(t => t.id === match.tournamentId);
        const homeTeam = teams.find(
          team => String(team.id) === String(match.homeTeamId)
        );
        const visitorTeam = teams.find(
          team => String(team.id) === String(match.visitorTeamId)
        );
        const isHomeMine = teamIds.includes(String(match.homeTeamId));
        const isVisitorMine = teamIds.includes(String(match.visitorTeamId));
        return {
          id: match.id,
          tournamentName: tournament?.name ?? "Torneo desconocido",
          round: match.round,
          date: new Date(match.date).toLocaleString(),
          home: homeTeam?.name ?? match.homeTeamId,
          visitor: visitorTeam?.name ?? match.visitorTeamId,
          score: `${match.homeScore} - ${match.visitorScore}`,
          isHomeMine,
          isVisitorMine,
        };
      }),
    [userMatches, tournaments, teams, teamIds]
  );

  if (loading) return <div className="p-4 text-gray-500">Cargando historial…</div>;
  if (error) return <div className="p-4 text-red-600">No se pudo cargar el historial.</div>;

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="text-2xl font-bold text-blue-700">
          Torneos jugados: {tournamentsPlayed.length}
        </div>
        <div className="text-2xl font-bold text-green-700">
          Torneos ganados: {tournamentsWon}
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-4">Historial de partidos</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="px-4 py-2">Torneo</th>
              <th className="px-4 py-2">Ronda</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Local</th>
              <th className="px-4 py-2">Visitante</th>
              <th className="px-4 py-2">Marcador</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.id} className="border-b last:border-none">
                <td className="px-4 py-2">{row.tournamentName}</td>
                <td className="px-4 py-2">{row.round}</td>
                <td className="px-4 py-2">{row.date}</td>
                <td className={`px-4 py-2 font-semibold ${row.isHomeMine ? "text-blue-600" : ""}`}>
                  {row.home}
                  {row.isHomeMine && <span className="ml-2 text-xs text-blue-400">(Tu equipo)</span>}
                </td>
                <td className={`px-4 py-2 font-semibold ${row.isVisitorMine ? "text-blue-600" : ""}`}>
                  {row.visitor}
                  {row.isVisitorMine && <span className="ml-2 text-xs text-blue-400">(Tu equipo)</span>}
                </td>
                <td className="px-4 py-2">{row.score}</td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  No hay partidos jugados todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}