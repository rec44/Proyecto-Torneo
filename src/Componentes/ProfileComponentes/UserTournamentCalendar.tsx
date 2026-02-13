/**
 * UserTournamentCalendar
 * 
 * Muestra un calendario sencillo con los torneos en los que el usuario participa o ha creado.
 * - Lista los torneos ordenados por fecha de inicio.
 * - Muestra nombre, fechas y un botón para ver el bracket del torneo.
 * - Si no hay torneos, muestra un mensaje informativo.
 */

import { useMemo } from "react";
import { useTournaments } from "../../hooks/useTournaments";
import { useTeams } from "../../hooks/useTeams";
import { useNavigate } from "react-router-dom";

interface Props {
  userId: string;
}

/**
 * Componente principal del calendario de torneos del usuario.
 */
export default function UserTournamentCalendar({ userId }: Props) {
  const navigate = useNavigate();
  const { tournaments } = useTournaments();
  const { teams } = useTeams();

  /**
   * Calcula los torneos en los que el usuario es capitán o creador.
   * Devuelve una lista ordenada por fecha de inicio.
   */
  const myTournamentDays = useMemo(() => {
    const myTeamTournamentIds = teams
      .filter(team => team.captainId === userId)
      .map(team => team.tournamentId);

    return tournaments
      .filter(
        torneo =>
          torneo.ownerId === userId ||
          myTeamTournamentIds.includes(torneo.id)
      )
      .map(torneo => ({
        id: torneo.id,
        name: torneo.name,
        startDate: new Date(torneo.startDate),
        endDate: new Date(torneo.endDate),
      }))
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }, [teams, tournaments, userId]);

  // Si no hay torneos, muestra mensaje
  if (!myTournamentDays.length) {
    return (
      <div className="bg-white rounded-2xl shadow p-6 text-center text-gray-500">
        No tienes torneos programados.
      </div>
    );
  }

  // Render principal: lista de torneos con fechas y botón para ver el bracket
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Calendario de torneos</h2>
      <ul className="space-y-3">
        {myTournamentDays.map(day => (
          <li
            key={day.id}
            className="border rounded-lg px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
          >
            <div>
              <p className="font-semibold text-lg">{day.name}</p>
              <p className="text-sm text-gray-500">
                Inicio: {day.startDate.toLocaleDateString()} &nbsp;|&nbsp; Fin:{" "}
                {day.endDate.toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-blue-600">
                {day.startDate.toLocaleDateString() === day.endDate.toLocaleDateString()
                  ? `Día completo: ${day.startDate.toLocaleDateString()}`
                  : `Del ${day.startDate.toLocaleDateString()} al ${day.endDate.toLocaleDateString()}`}
              </span>
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm"
                onClick={() => navigate(`/tournamentBracket/${day.id}`)}
              >
                Ver torneo
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}