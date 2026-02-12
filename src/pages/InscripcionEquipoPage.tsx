import { useParams } from "react-router-dom";
import { useTournaments } from "../hooks/useTournaments";
import { useTeams } from "../hooks/useTeams"; // <-- Importa tu hook de equipos
import InscripcionEquipoForm from "../Componentes/InscripcionEquipoForm";
import Navegacion from "../Componentes/Navegacion";

export default function InscripcionEquipoPage() {
  const { id } = useParams();
  const { tournaments, loading: loadingTournaments } = useTournaments();
  const { teams, loading: loadingTeams } = useTeams(); // <-- Usa el hook

  const torneo = tournaments.find(t => t.id === id);

  if (loadingTournaments || loadingTeams) {
    return (
      <>
        <Navegacion />
        <div className="min-h-screen flex items-center justify-center">
          <span className="text-gray-500">Cargando torneo...</span>
        </div>
      </>
    );
  }

  if (!torneo) {
    return (
      <>
        <Navegacion />
        <div className="min-h-screen flex items-center justify-center">
          <span className="text-red-500">Torneo no encontrado.</span>
        </div>
      </>
    );
  }

  return (
    <>
      <Navegacion />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-xl">
          <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
            Inscripción de equipo en "{torneo.name}"
          </h1>
          <InscripcionEquipoForm
            tournament={torneo}
            equiposInscritos={teams.filter(eq => eq.tournamentId === torneo.id)}
            // ...otras props
          />
        </div>
      </div>
    </>
  );
}