import { useParams, useNavigate } from "react-router-dom";
import { useTournaments } from "../hooks/useTournaments";
import TournamentForm from "../Componentes/TournamentForm";
import { tournamentService } from "../services/tournamentService";
import Navegacion from "../Componentes/Navegacion";

export default function EditTournamentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tournaments } = useTournaments();
  const tournament = tournaments.find(t => t.id === id);

  if (!tournament) return <div>Torneo no encontrado</div>;

  const handleUpdate = async (data: Omit<typeof tournament, "id" | "ownerId" | "createdAt">) => {
    const updatedTournament: typeof tournament = { ...tournament, ...data };
    await tournamentService.update(updatedTournament.id, updatedTournament);
    navigate(`/tournament/${updatedTournament.id}`);
  };

  return (
    <>
      <Navegacion />
      <div className="min-h-screen bg-gray-100 px-4 py-10">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8">
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