const API_URL = "http://localhost:3001";
import type { Match } from "../types/match";

export const matchService = {
  async getAll(): Promise<Match[]> {
    const res = await fetch(`${API_URL}/matches`);
    if (!res.ok) throw new Error("Error al obtener los partidos");
    return res.json();
  },

  async getById(id: string): Promise<Match | null> {
    const res = await fetch(`${API_URL}/matches/${id}`);
    if (!res.ok) return null;
    return res.json();
  },

  async create(match: Omit<Match, "id">): Promise<Match> {
    const res = await fetch(`${API_URL}/matches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(match),
    });
    if (!res.ok) throw new Error("Error al crear el partido");
    return res.json();
  },

  async update(id: string, match: Partial<Match>): Promise<Match> {
    const res = await fetch(`${API_URL}/matches/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(match),
    });
    if (!res.ok) throw new Error("Error al actualizar el partido");
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/matches/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Error al eliminar el partido");
  },
};