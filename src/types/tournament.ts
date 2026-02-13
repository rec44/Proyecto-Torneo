export interface Tournament {
  id: string;
  name: string;
  sport: string;
  category: string;
  maxTeams: number;
  minTeams: number;
  maxPlayersPerTeam: number;
  minPlayersPerTeam: number; // ← añadido
  startDate: string;
  endDate: string;
  status: 'open' | 'closed' | 'finished';
  community: string;
  province: string;
  city: string;
  venue: string;
  description?: string;
  createdAt: string;
  ownerId: string;
}