/**
 * CreateTournamentPage
 * 
 * Página para crear un nuevo torneo.
 * - Muestra el formulario de creación de torneo.
 * - Al guardar, crea el torneo y redirige a la página de "Mis Torneos" con SweetAlert.
 * - Incluye botón para volver atrás.
 */
import TournamentForm from "../Componentes/TournamentsComponentes/TournamentForm";
import { useAuth } from "../hooks/useAuth";
import { tournamentService } from "../services/tournamentService";
import type { Tournament } from "../types/tournament";
import Navegacion from "../Componentes/Navegacion";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

type CreateTournamentData = Omit<
  Tournament,
  "id" | "createdAt" | "currentTeams" | "ownerId" | "participants"
>;

export default function CreateTournamentPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Maneja la creación del torneo con SweetAlert
  const handleCreate = async (data: CreateTournamentData) => {
    if (!user) return;
    await tournamentService.create({
      ...data,
      ownerId: user.id
    });
    await Swal.fire({
      icon: "success",
      title: "¡Torneo creado correctamente!",
      timer: 1500,
      showConfirmButton: false,
    });
    navigate(`/MyTournaments/${user.id}`);
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
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Crear torneo</h1>
          <TournamentForm onSubmit={handleCreate} />
        </div>
      </div>
    </>
  );
}