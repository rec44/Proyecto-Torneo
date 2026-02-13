/**
 * MyTournamentsPage
 * 
 * Página para mostrar los torneos del usuario.
 * - Permite cambiar entre torneos activos y el historial de torneos finalizados mediante pestañas.
 * - Muestra los torneos creados por el usuario y los torneos en los que está inscrito como capitán.
 * - Si el número de equipos no llega al mínimo, lo señala en rojo y muestra aviso de posible cancelación.
 */
import Navegacion from "../Componentes/Navegacion";
import { useAuth } from "../hooks/useAuth";
import { useTournaments } from "../hooks/useTournaments";
import { useEffect, useState } from "react";
import { teamService } from "../services/teamService";
import type { Team } from "../types/team";
import { useNavigate } from "react-router-dom";
import { getTournamentStatus } from "../utils/getTournamentStatus";

export default function MyTournamentsPage() {
  const { user } = useAuth();
  const { tournaments } = useTournaments();
  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [activeTab, setActiveTab] = useState<"activos" | "historial">("activos");
  const navigate = useNavigate();

  // Al montar, carga todos los equipos y filtra los del usuario
  useEffect(() => {
    if (!user) return;
    teamService.getAll().then(teams => {
      setAllTeams(teams);
      setMyTeams(teams.filter(team => team.captainId === user.id));
    });
  }, [user]);

  // IDs de torneos en los que el usuario está inscrito como capitán
  const joinedTournamentIds = myTeams.map(team => team.tournamentId);

  // Orden y etiquetas de estado de torneo
  const statusOrder: Record<string, number> = {
    inprogress: 0,
    open: 1,
    closed: 2,
  };
  const statusLabel: Record<string, string> = {
    open: "Abierto",
    closed: "Cerrado",
    inprogress: "En curso",
  };
  const statusColor: Record<string, string> = {
    open: "bg-green-100 text-green-700",
    closed: "bg-red-100 text-red-700",
    inprogress: "bg-blue-100 text-blue-700",
  };

  /**
   * Decora la lista de torneos con estado y número de equipos.
   * Filtra por finalizados o activos según la pestaña.
   * Limita el historial a 10 torneos.
   */
  const decorate = (
    list: typeof tournaments,
    includeFinished: boolean,
    limit?: number
  ) =>
    list
      .map(t => {
        const status = getTournamentStatus(t, allTeams);
        const teamCount = allTeams.filter(team => team.tournamentId === t.id)
          .length;
        return { ...t, status, teamCount };
      })
      .filter(t =>
        includeFinished ? t.status === "finished" : t.status !== "finished"
      )
      .sort(
        (a, b) =>
          (statusOrder[a.status] ?? 3) - (statusOrder[b.status] ?? 3)
      )
      .slice(0, limit ?? list.length);

  // Torneos creados por el usuario
  const createdTournaments = decorate(
    tournaments.filter(t => t.ownerId === user?.id),
    activeTab === "historial",
    activeTab === "historial" ? 10 : undefined
  );
  // Torneos en los que participa como capitán
  const joinedTournaments = decorate(
    tournaments.filter(
      t => joinedTournamentIds.includes(t.id) && t.ownerId !== user?.id
    ),
    activeTab === "historial",
    activeTab === "historial" ? 10 : undefined
  );

  /**
   * Renderiza una tarjeta de torneo con información y botón de brackets.
   * Señala en rojo si no se alcanza el mínimo de equipos.
   */
  const renderTournamentCard = (t: ReturnType<typeof decorate>[number], bg: string) => {
    const meetsMinimum = t.teamCount >= t.minTeams;
    return (
      <li
        key={t.id}
        className={`border rounded-lg p-4 ${bg} flex flex-col md:flex-row md:items-center md:justify-between`}
      >
        <div>
          <div className="font-semibold text-lg">{t.name}</div>
          <div className="text-sm text-gray-600">
            {t.city} - {t.sport}
          </div>
          <div className="text-xs text-gray-400">
            Inicio: {t.startDate} | Fin: {t.endDate}
          </div>
          <p
            className={`mt-2 text-sm font-semibold ${
              meetsMinimum ? "text-gray-700" : "text-red-600"
            }`}
          >
            Equipos: {t.teamCount}/{t.maxTeams} &middot; Mínimo requerido: {t.minTeams}
            {!meetsMinimum && " • Se cancelará si no alcanza el mínimo antes del inicio"}
          </p>
          <span
            className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
              statusColor[t.status]
            }`}
          >
            {statusLabel[t.status]}
          </span>
        </div>
        <button
          className="mt-2 md:mt-0 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          onClick={() => navigate(`/tournamentBracket/${t.id}`)}
        >
          Ver brackets
        </button>
      </li>
    );
  };

  // Render principal: pestañas, torneos creados y torneos inscritos
  return (
    <>
      <Navegacion />
      <div className="min-h-screen bg-gray-100 px-4 py-10">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Mis Torneos</h1>

          <div className="flex gap-3 mb-6">
            <button
              className={`flex-1 py-2 rounded-lg font-semibold ${
                activeTab === "activos"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveTab("activos")}
            >
              Torneos activos
            </button>
            <button
              className={`flex-1 py-2 rounded-lg font-semibold ${
                activeTab === "historial"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveTab("historial")}
            >
              Historial finalizados
            </button>
          </div>

          {/* Torneos creados */}
          <h2 className="text-xl font-semibold mb-2 mt-4">Creados por mí</h2>
          {createdTournaments.length === 0 ? (
            <div className="text-gray-500 text-center mb-6">
              No has creado ningún torneo.
            </div>
          ) : (
            <ul className="space-y-4 mb-8">
              {createdTournaments.map(t => renderTournamentCard(t, "bg-blue-50"))}
            </ul>
          )}

          {/* Torneos en los que participo */}
          <h2 className="text-xl font-semibold mb-2 mt-4">
            Inscrito como capitán
          </h2>
          {joinedTournaments.length === 0 ? (
            <div className="text-gray-500 text-center">
              No estás inscrito en ningún torneo.
            </div>
          ) : (
            <ul className="space-y-4">
              {joinedTournaments.map(t => renderTournamentCard(t, "bg-green-50"))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
