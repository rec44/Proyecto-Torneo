import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navegacion from "../Componentes/Navegacion";
import InscripcionEquipoForm from "../Componentes/InscripcionEquipoForm";
import { teamService } from "../services/teamService";
import { tournamentService } from "../services/tournamentService";
import type { Team } from "../types/team";
import type { Tournament } from "../types/tournament";

export default function EditTeam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <>
        <Navegacion />
        <div className="min-h-screen flex items-center justify-center">Cargando...</div>
      </>
    );
  }

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

  return (
    <>
      <Navegacion />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-lg">
          <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">Editar equipo</h1>
          <InscripcionEquipoForm
            tournament={tournament}
            team={team}
            mode="edit"
            submitLabel="Guardar cambios"
            onSuccess={() => navigate(-1)}
          />
        </div>
      </div>
    </>
  );
}