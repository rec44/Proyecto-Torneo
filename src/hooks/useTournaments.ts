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

  const updateTournament = async (id: string, tournament: Tournament) => {
    try {
      const updated = await tournamentService.update(id, tournament);
      setTournaments(prev =>
        prev.map(t => (t.id === id ? updated : t))
      );
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar');
      throw err;
    }
  };

  const deleteTournament = async (id: string) => {
    try {
      await tournamentService.delete(id);
      setTournaments(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
      throw err;
    }
  };

  return {
    tournaments,
    loading,
    error,
    fetchTournaments,
    addTournament,
    updateTournament,
    deleteTournament,
  };
}