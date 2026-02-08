import { useEffect, useState } from "react";
import { teamService } from "../services/teamService";
import type { Team } from "../types/team";

export function useTeams(tournamentId?: string) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tournamentId) {
      setTeams([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    teamService.getByTournament(tournamentId)
      .then(setTeams)
      .finally(() => setLoading(false));
  }, [tournamentId]);

  return { teams, loading };
}