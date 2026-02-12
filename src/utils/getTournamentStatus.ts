import type { Tournament } from "../types/tournament";
import type { Team } from "../types/team";

export function getTournamentStatus(tournament: Tournament, teams: Team[]) {
  const now = new Date();
  const start = new Date(tournament.startDate);
  const end = new Date(tournament.endDate);
  const inscritos = teams.filter(t => t.tournamentId === tournament.id).length;

  // Si el torneo ya terminó
  if (now > end) return "finished";

  // Si el torneo está en curso (entre inicio y fin)
  if (now >= start && now <= end) {
    // Si las plazas están llenas, pero aún no ha terminado, está "en curso"
    if (inscritos >= tournament.maxTeams) return "inprogress";
    // Si la fecha de inicio ya pasó, está "en curso"
    return "inprogress";
  }

  // Si aún no empieza
  if (now < start) return "open";

  return "open";
}