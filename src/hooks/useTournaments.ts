import { useState, useEffect } from 'react';
import { tournamentService} from '../services/tournamentService';
import type { Tournament } from '../types/tournament';

export function useTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const data = await tournamentService.getAll();
      setTournaments(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const addTournament = async (
    tournament: Omit<Tournament, 'id' | 'createdAt' | 'currentTeams'>
  ) => {
    try {
      const newTournament = await tournamentService.create(tournament);
      setTournaments([...tournaments, newTournament]);
      return newTournament;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear');
      throw err;
    }
  };

  return { tournaments, loading, error, fetchTournaments, addTournament };
}