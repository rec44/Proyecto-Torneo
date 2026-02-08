import type { Tournament } from '../types/tournament';

const API_URL = 'http://localhost:3001';

export const tournamentService = {
  // Obtener todos los torneos
  getAll: async (): Promise<Tournament[]> => {
    const response = await fetch(`${API_URL}/tournaments`);
    if (!response.ok) throw new Error('Error al obtener torneos');
    return response.json();
  },

  // Obtener un torneo por ID
  getById: async (id: string): Promise<Tournament> => {
    const response = await fetch(`${API_URL}/tournaments/${id}`);
    if (!response.ok) throw new Error('Torneo no encontrado');
    return response.json();
  },

  // Crear nuevo torneo
  create: async (
    tournament: Omit<Tournament, 'id' | 'createdAt' | 'currentTeams'>
  ): Promise<Tournament> => {
    const response = await fetch(`${API_URL}/tournaments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...tournament,
        currentTeams: 0,
        createdAt: new Date().toISOString(),
      }),
    });
    if (!response.ok) throw new Error('Error al crear torneo');
    return response.json();
  },

  // Actualizar torneo
  update: async (id: string, tournament: Tournament): Promise<Tournament> => {
    const response = await fetch(`${API_URL}/tournaments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tournament)
    });
    if (!response.ok) throw new Error('Error al actualizar torneo');
    return response.json();
  },

  // Eliminar torneo
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/tournaments/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al eliminar torneo');
  }
};