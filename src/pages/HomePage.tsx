/**
 * HomePage
 * 
 * Página principal de la aplicación.
 * - Muestra la barra de navegación y el título.
 * - Permite filtrar torneos por nombre, deporte, estado, comunidad y provincia.
 * - Filtra torneos según el estado real, inscripción y propiedad del usuario.
 */
import { useEffect, useState } from "react";
import { useTournaments } from "../hooks/useTournaments";
import { useFilter } from "../hooks/useFilter";
import TournamentList from "../Componentes/TournamentsComponentes/TournamentList";
import TournamentFilter from "../Componentes/TournamentsComponentes/TournamentFilter";
import Navegacion from "../Componentes/Navegacion";
import { locationService } from "../services/locationServices";
import { useTeams } from "../hooks/useTeams";
import { getTournamentStatus } from "../utils/getTournamentStatus";
import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const { user } = useAuth();
  const { tournaments, loading, error } = useTournaments();
  const { teams } = useTeams(); 
  const { filters, setFilters, filteredTournaments } = useFilter(tournaments);

  const [comunidades, setComunidades] = useState<
    { codigo: string; nombre: string }[]
  >([]);
  const [provincias, setProvincias] = useState<
    { codigo: string; nombre: string }[]
  >([]);

  // Cargar comunidades al montar
  useEffect(() => {
    locationService.getComunidades().then(setComunidades);
  }, []);

  // Cargar provincias cuando cambia la comunidad
  useEffect(() => {
    if (filters.community) {
      locationService
        .getProvinciasByComunidad(filters.community)
        .then(setProvincias);
    } else {
      setProvincias([]);
    }
  }, [filters.community]);

  if (loading)
    return (
      <>
        <Navegacion />
        <p className="text-center p-6">Cargando torneos...</p>
      </>
    );

  if (error)
    return (
      <>
        <Navegacion />
        <p className="text-center p-6 text-red-600">Error: {error}</p>
      </>
    );

  // Torneos en los que el usuario ya está inscrito
  const joinedTournamentIds = teams
    .filter(team => team.captainId === user?.id)
    .map(team => team.tournamentId);

  // Filtra por estado real según la fecha
  let torneosFiltrados = filteredTournaments;

  if (filters.status) {
    torneosFiltrados = torneosFiltrados.filter(
      torneo => getTournamentStatus(torneo, teams) === filters.status
    );
  }

  // Quita los torneos finalizados si no se filtra explícitamente por estado
  const mostrarFinalizados =
    filters.status && filters.status.toLowerCase() === "finished";
  if (!mostrarFinalizados) {
    torneosFiltrados = torneosFiltrados.filter(
      torneo => getTournamentStatus(torneo, teams) !== "finished"
    );
  }

  // Quita los torneos donde el usuario es owner o ya está inscrito
  torneosFiltrados = torneosFiltrados.filter(
    torneo =>
      torneo.ownerId !== user?.id &&
      !joinedTournamentIds.includes(torneo.id)
  );

  // Render principal: filtros y lista de torneos
  return (
    <>
      <Navegacion />
      <div className="min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold text-center pt-8 mb-6">Torneos</h1>
        <TournamentFilter
          filters={filters}
          onFilterChange={setFilters}
          comunidades={comunidades}
          provincias={provincias}
        />
        {torneosFiltrados.length === 0 ? (
          <div className="text-center text-gray-500 py-8 text-2xl">
            No hay torneos que coincidan con el filtro.
          </div>
        ) : (
          <TournamentList tournaments={torneosFiltrados} />
        )}
      </div>
    </>
  );
}
