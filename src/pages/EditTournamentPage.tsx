/**
 * EditTournamentPage
 * 
 * Página para editar un torneo existente.
 * - Muestra el formulario de edición con los datos actuales.
 * - Al guardar, actualiza el torneo y redirige a la página de detalles con SweetAlert.
 */
import { useParams, useNavigate } from "react-router-dom";
import { useTournaments } from "../hooks/useTournaments";
import TournamentForm from "../Componentes/TournamentsComponentes/TournamentForm";
import { tournamentService } from "../services/tournamentService";
import Navegacion from "../Componentes/Navegacion";
import Swal from "sweetalert2";

export default function EditTournamentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tournaments } = useTournaments();
  // Busca el torneo por ID
  const tournament = tournaments.find(t => t.id === id);

  // Si no existe, muestra mensaje de error
  if (!tournament) return <div>Torneo no encontrado</div>;

  /**
   * Maneja la actualización del torneo con SweetAlert.
   */
  const handleUpdate = async (data: Omit<typeof tournament, "id" | "ownerId" | "createdAt">) => {
    const updatedTournament: typeof tournament = { ...tournament, ...data };
    await tournamentService.update(updatedTournament.id, updatedTournament);
    await Swal.fire({
      icon: "success",
      title: "Torneo actualizado correctamente",
      timer: 1500,
      showConfirmButton: false,
    });
    navigate(`/tournament/${updatedTournament.id}`);
  };

  // Render principal
  return (
    <>
      <Navegacion />
      <div className="min-h-screen bg-gray-100 px-4 py-10">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8">
          <button
            className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
            onClick={() => navigate(-1)}
          >
            ← Volver
          </button>
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Editar torneo</h1>
          <TournamentForm
            onSubmit={handleUpdate}
            initialValues={tournament}
            submitLabel="Guardar cambios"
          />
        </div>
      </div>
    </>
  );
}