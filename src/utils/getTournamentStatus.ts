import type { Tournament } from "../types/tournament";
import type { Team } from "../types/team";

export function getTournamentStatus(tournament: Tournament, teams: Team[]) {
  const now = new Date();
  const start = new Date(tournament.startDate);
  const end = new Date(tournament.endDate);
  const inscritos = teams.filter(t => t.tournamentId === tournament.id).length;

  if (now < start) return "open"; // Aún no empieza
  if (now >= start && now <= end) {
    if (inscritos >= tournament.maxTeams) return "closed"; // Plazas llenas
    return "open"; // Abierto y en curso
  }
  if (now > end) return "finished"; // Ya terminó
  return "open";
}