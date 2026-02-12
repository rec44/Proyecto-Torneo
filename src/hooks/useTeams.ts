import { useEffect, useState } from "react";
import { teamService } from "../services/teamService";
import type { Team } from "../types/team";

export function useTeams(tournamentId?: string) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchTeams = tournamentId
      ? teamService.getByTournament(tournamentId)
      : teamService.getAll();

    fetchTeams
      .then(setTeams)
      .catch(() => setError("Error al cargar equipos"))
      .finally(() => setLoading(false));
  }, [tournamentId]);

  return { teams, loading, error };
}