/**
 * InscripcionEquipoPage
 * 
 * Página para inscribir un equipo en un torneo.
 * - Muestra el formulario de inscripción de equipo.
 */
import { useParams, useNavigate } from "react-router-dom";
import { useTournaments } from "../../hooks/useTournaments";
import { useTeams } from "../../hooks/useTeams";
import InscripcionEquipoForm from "../../Componentes/TournamentsComponentes/InscripcionEquipoForm";
import Navegacion from "../../Componentes/Navegacion";
import Swal from "sweetalert2";

export default function InscripcionEquipoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tournaments, loading: loadingTournaments } = useTournaments();
  const { teams, loading: loadingTeams } = useTeams();

  // Busca el torneo por ID
  const torneo = tournaments.find(t => t.id === id);

  // Muestra mensaje de carga si los datos no están listos
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

  // Muestra mensaje de error si el torneo no existe
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

  /**
   * Handler para mostrar SweetAlert y volver atrás tras inscribir equipo.
   */
  const handleSuccess = async () => {
    await Swal.fire({
      icon: "success",
      title: "¡Equipo inscrito correctamente!",
      timer: 1500,
      showConfirmButton: false,
    });
    navigate(-1);
  };

  // Render principal: formulario de inscripción de equipo y botón volver
  return (
    <>
      <Navegacion />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-xl">
          <button
            className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
            onClick={() => navigate(-1)}
          >
            ← Volver
          </button>
          <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
            Inscripción de equipo en "{torneo.name}"
          </h1>
          <InscripcionEquipoForm
            tournament={torneo}
            equiposInscritos={teams.filter(eq => eq.tournamentId === torneo.id)}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </>
  );
}