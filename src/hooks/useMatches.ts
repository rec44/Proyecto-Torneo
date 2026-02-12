import { useEffect, useState, useCallback } from "react";
import { matchService } from "../services/matchService";
import type { Match } from "../types/match";

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await matchService.getAll();
      setMatches(data);
    } catch (err) {
      setError("Error al cargar los partidos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const createMatch = async (match: Omit<Match, "id">) => {
    const newMatch = await matchService.create(match);
    await fetchMatches();
    return newMatch;
  };

  const updateMatch = async (id: string, match: Partial<Match>) => {
    const updated = await matchService.update(id, match);
    await fetchMatches();
    return updated;
  };

  const deleteMatch = async (id: string) => {
    await matchService.delete(id);
    await fetchMatches();
  };

  return {
    matches,
    loading,
    error,
    createMatch,
    updateMatch,
    deleteMatch,
    fetchMatches,
  };
}