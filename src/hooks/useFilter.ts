import { useState, useMemo } from 'react';
import type { Tournament } from '../types/tournament';

export function useFilter(tournaments: Tournament[]) {
  const [filters, setFilters] = useState({
    search: '',
    sport: '',
    status: '',
    community: '',
    province: ''
  });

  // Filtra los torneos según los filtros
  const filteredTournaments = useMemo(() => {
    return tournaments.filter(t =>
      (
        t.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.city?.toLowerCase().includes(filters.search.toLowerCase())
      ) &&
      (filters.sport === '' || t.sport === filters.sport) &&
      (filters.status === '' || t.status === filters.status) &&
      (filters.community === '' || t.community === filters.community) &&
      (filters.province === '' || t.province === filters.province)
    );
  }, [tournaments, filters]);

  return { filters, setFilters, filteredTournaments };
}