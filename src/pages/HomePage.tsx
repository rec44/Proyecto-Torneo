import { useEffect, useState } from "react";
import { useTournaments } from "../hooks/useTournaments";
import { useFilter } from "../hooks/useFilter";
import TournamentList from "../Componentes/TournamentList";
import TournamentFilter from "../Componentes/TournamentFilter";
import Navegacion from "../Componentes/Navegacion";
import { locationService } from "../services/locationServices";

export default function HomePage() {
  const { tournaments, loading, error } = useTournaments();
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
        {filteredTournaments.length === 0 ? (
          <div className="text-center text-gray-500 py-8 text-2xl">
            No hay torneos que coincidan con el filtro.
          </div>
        ) : (
          <TournamentList tournaments={filteredTournaments} />
        )}
      </div>
    </>
  );
}
