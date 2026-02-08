import TournamentForm from "../Componentes/TournamentForm";
import { useAuth } from "../hooks/useAuth";
import { tournamentService } from "../services/tournamentService";
import type { Tournament } from "../types/tournament";
import Navegacion from "../Componentes/Navegacion";
import { useNavigate } from "react-router-dom";

type CreateTournamentData = Omit<
  Tournament,
  "id" | "createdAt" | "currentTeams" | "ownerId" | "participants"
>;

export default function CreateTournamentPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCreate = async (data: CreateTournamentData) => {
    if (!user) return;
    await tournamentService.create({
      ...data,
      ownerId: user.id
    });
    navigate(`/MyTournaments/${user.id}`);
  };

  return (
    <>
      <Navegacion />
      <div className="min-h-screen bg-gray-100 px-4 py-10">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Crear torneo</h1>
          <TournamentForm onSubmit={handleCreate} />
        </div>
      </div>
    </>
  );
}