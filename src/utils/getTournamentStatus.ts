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
    return "inprogress";
  }

  // Si aún no empieza pero está lleno
  if (now < start && inscritos >= tournament.maxTeams) return "closed";

  // Si aún no empieza y no está lleno
  if (now < start) return "open";

  return "open";
}