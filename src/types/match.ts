export interface Match {
  id: string;
  tournamentId: string;
  gameId: string;
  round: number;
  date: string;
  homeTeamId: string;
  visitorTeamId: string;
  homeScore: number;
  visitorScore: number;
}