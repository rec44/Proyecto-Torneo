import type { Team } from "../types/team";

const API_URL = "http://localhost:3001";

export const teamService = {
  async getAll(): Promise<Team[]> {
    const res = await fetch(`${API_URL}/teams`);
    if (!res.ok) throw new Error("Error al obtener equipos");
    return res.json();
  },

  async getByTournament(tournamentId: string): Promise<Team[]> {
    const res = await fetch(`${API_URL}/teams?tournamentId=${tournamentId}`);
    if (!res.ok) throw new Error("Error al obtener equipos del torneo");
    return res.json();
  },

  async create(team: Omit<Team, "id">): Promise<Team> {
    const res = await fetch(`${API_URL}/teams`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(team),
    });
    if (!res.ok) throw new Error("Error al crear equipo");
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/teams/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar equipo");
  },
};