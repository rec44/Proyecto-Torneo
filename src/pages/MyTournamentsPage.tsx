import Navegacion from "../Componentes/Navegacion";
import { useAuth } from "../hooks/useAuth";
import { useTournaments } from "../hooks/useTournaments";
import { useEffect, useState } from "react";
import { teamService } from "../services/teamService";
import type { Team } from "../types/team";

export default function MyTournamentsPage() {
  const { user } = useAuth();
  const { tournaments } = useTournaments();
  const [myTeams, setMyTeams] = useState<Team[]>([]);

  // Torneos creados por el usuario
  const createdTournaments = tournaments.filter(t => t.ownerId === user?.id);

  // Torneos en los que el usuario está inscrito como capitán de equipo
  const joinedTournamentIds = myTeams.map(team => team.tournamentId);
  const joinedTournaments = tournaments.filter(
    t => joinedTournamentIds.includes(t.id) && t.ownerId !== user?.id
  );

  useEffect(() => {
    if (user) {
      teamService.getAll().then(teams => {
        setMyTeams(teams.filter(team => team.captainId === user.id));
      });
    }
  }, [user]);

  return (
    <>
      <Navegacion />
      <div className="min-h-screen bg-gray-100 px-4 py-10">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Mis Torneos</h1>

          {/* Torneos creados */}
          <h2 className="text-xl font-semibold mb-2 mt-4">Creados por mí</h2>
          {createdTournaments.length === 0 ? (
            <div className="text-gray-500 text-center mb-6">No has creado ningún torneo.</div>
          ) : (
            <ul className="space-y-4 mb-8">
              {createdTournaments.map(t => (
                <li key={t.id} className="border rounded-lg p-4 bg-blue-50">
                  <div className="font-semibold text-lg">{t.name}</div>
                  <div className="text-sm text-gray-600">{t.city} - {t.sport}</div>
                  <div className="text-xs text-gray-400">Inicio: {t.startDate} | Fin: {t.endDate}</div>
                </li>
              ))}
            </ul>
          )}

          {/* Torneos en los que participo */}
          <h2 className="text-xl font-semibold mb-2 mt-4">Inscrito como capitán</h2>
          {joinedTournaments.length === 0 ? (
            <div className="text-gray-500 text-center">No estás inscrito en ningún torneo.</div>
          ) : (
            <ul className="space-y-4">
              {joinedTournaments.map(t => (
                <li key={t.id} className="border rounded-lg p-4 bg-green-50">
                  <div className="font-semibold text-lg">{t.name}</div>
                  <div className="text-sm text-gray-600">{t.city} - {t.sport}</div>
                  <div className="text-xs text-gray-400">Inicio: {t.startDate} | Fin: {t.endDate}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
