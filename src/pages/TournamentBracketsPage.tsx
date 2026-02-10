import { useParams } from "react-router-dom";
import { useTeams } from "../hooks/useTeams";
import { useEffect, useState } from "react";
import { tournamentService } from "../services/tournamentService";
import { userService } from "../services/userServices";
import TournamentDetail from "../Componentes/TournamentDetail";
import TournamentBrackets from "../Componentes/TournamanetBrackets";
import BracketsRender from "../Componentes/BracketsRender";
import type { Tournament } from "../types/tournament";
import type { User } from "../types/user";
import Navegacion from "../Componentes/Navegacion";

export default function TournamentBracketsPage() {
  const { id } = useParams();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const { teams } = useTeams(id);

  useEffect(() => {
    if (id) tournamentService.getById(id).then(setTournament);
    userService.getAll().then(setUsers);
  }, [id]);

  if (!tournament) return <div>Cargando...</div>;

  return (
    <>
      <Navegacion />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <BracketsRender
          teams={teams.map((team) => ({
            id: String(team.id),
            name: team.name,
          }))}
        />

        <TournamentBrackets
          teams={teams}
          users={users}
          tournamentOwnerId={tournament.ownerId}
        />
        {/* Detalles abajo */}
        <TournamentDetail tournament={tournament} teams={teams} />
      </div>
    </>
  );
}