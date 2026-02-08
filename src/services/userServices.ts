import type { User } from "../types/user";

const API_URL = "http://localhost:3001";

export const userService = {
  async getAll(): Promise<User[]> {
    const res = await fetch(`${API_URL}/users`);
    if (!res.ok) throw new Error("Error al obtener usuarios");
    return res.json();
  },

  async getById(id: string|undefined): Promise<User> {
    const res = await fetch(`${API_URL}/users/${id}`);
    if (!res.ok) throw new Error("Usuario no encontrado");
    return res.json();
  },

  async getByEmail(email: string): Promise<User | null> {
    const res = await fetch(`${API_URL}/users?email=${encodeURIComponent(email)}`);
    if (!res.ok) throw new Error("Error al buscar usuario");
    const users = await res.json();
    return users.length > 0 ? users[0] : null;
  },

  async create(user: Omit<User, "id">): Promise<User> {
    const res = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    if (!res.ok) throw new Error("Error al crear usuario");
    return res.json();
  },

  async delete(id: number | string): Promise<void> {
    const res = await fetch(`${API_URL}/users/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar usuario");
  },

  async update(id: number | string, user: Partial<User>): Promise<User> {
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    if (!res.ok) throw new Error("Error al actualizar usuario");
    return res.json();
  },
};