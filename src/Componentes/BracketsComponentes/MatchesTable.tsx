/**
 * MatchesTable
 *
 * Muestra el historial de partidos del torneo en una tabla.
 */
import { useMemo } from "react";
import type { Match } from "../../types/match";
import { useTournaments } from "../../hooks/useTournaments";
import { useTeams } from "../../hooks/useTeams";

interface Props {
  matches: Match[];
  loading?: boolean;
  error?: string | null;
}

/**
 * Renderiza la tabla de partidos jugados.
 */
export default function MatchesTable({ matches, loading, error }: Props) {
  const { tournaments } = useTournaments();
  const { teams } = useTeams();

  /**
   * Construye las filas de la tabla con datos de equipos y torneos.
   */
  const rows = useMemo(
    () =>
      matches.map(match => {
        const tournament = tournaments.find(t => t.id === match.tournamentId);
        const homeTeam = teams.find(
          team => String(team.id) === String(match.homeTeamId)
        );
        const visitorTeam = teams.find(
          team => String(team.id) === String(match.visitorTeamId)
        );
        return {
          id: match.id,
          tournamentName: tournament?.name ?? "Torneo desconocido",
          round: match.round,
          date: new Date(match.date).toLocaleString(),
          home: homeTeam?.name ?? match.homeTeamId,
          visitor: visitorTeam?.name ?? match.visitorTeamId,
          score: `${match.homeScore} - ${match.visitorScore}`,
        };
      }),
    [matches, tournaments, teams]
  );

  if (loading)
    return <div className="p-4 text-gray-500">Cargando resultados…</div>;
  if (error)
    return (
      <div className="p-4 text-red-600">
        No se pudieron cargar los partidos.
      </div>
    );

  // Render principal
  return (
    <div className="bg-white rounded-2xl shadow p-6">
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
                <td className="px-4 py-2 font-semibold">{row.home}</td>
                <td className="px-4 py-2 font-semibold">{row.visitor}</td>
                <td className="px-4 py-2">{row.score}</td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  No hay partidos registrados todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}