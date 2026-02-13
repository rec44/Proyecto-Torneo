/**
 * EditTeamPage
 * 
 * Página para editar un equipo inscrito en un torneo.
 * - Carga los datos del equipo y del torneo correspondiente.
 * - Muestra el formulario de edición de equipo.
 */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navegacion from "../../Componentes/Navegacion";
import InscripcionEquipoForm from "../../Componentes/TournamentsComponentes/InscripcionEquipoForm";
import { teamService } from "../../services/teamService";
import { tournamentService } from "../../services/tournamentService";
import { useTeams } from "../../hooks/useTeams";
import type { Team } from "../../types/team";
import type { Tournament } from "../../types/tournament";
import Swal from "sweetalert2";

export default function EditTeam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { teams, loading: loadingTeams } = useTeams();

  // Al montar, carga el equipo y el torneo correspondiente
  useEffect(() => {
    async function load() {
      try {
        if (!id) return;
        const teamData = await teamService.getById(id);
        if (!teamData) {
          setError("Equipo no encontrado");
          return;
        }
        setTeam(teamData);
        const tournamentData = await tournamentService.getById(teamData.tournamentId);
        setTournament(tournamentData);
      } catch {
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // Muestra mensaje de carga si los datos no están listos
  if (loading || loadingTeams) {
    return (
      <>
        <Navegacion />
        <div className="min-h-screen flex items-center justify-center">Cargando...</div>
      </>
    );
  }

  // Muestra mensaje de error si no hay datos suficientes
  if (error || !team || !tournament) {
    return (
      <>
        <Navegacion />
        <div className="min-h-screen flex items-center justify-center text-red-600">
          {error ?? "Datos incompletos"}
        </div>
      </>
    );
  }

  /**
   * Handler para mostrar SweetAlert y volver atrás tras guardar cambios.
   */
  const handleSuccess = async () => {
    await Swal.fire({
      icon: "success",
      title: "Equipo actualizado correctamente",
      timer: 1500,
      showConfirmButton: false,
    });
    navigate(-1);
  };

  // Render principal: formulario de edición de equipo y botón volver
  return (
    <>
      <Navegacion />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-lg">
          <button
            className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
            onClick={() => navigate(-1)}
          >
            ← Volver
          </button>
          <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">Editar equipo</h1>
          <InscripcionEquipoForm
            tournament={tournament}
            team={team}
            equiposInscritos={teams.filter(eq => eq.tournamentId === tournament.id)}
            mode="edit"
            submitLabel="Guardar cambios"
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </>
  );
}