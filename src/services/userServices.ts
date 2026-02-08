import type { User } from "../types/user";

const API_URL = "http://localhost:3001";

export const userService = {
  async getAll(): Promise<User[]> {
    const res = await fetch(`${API_URL}/users`);
    if (!res.ok) throw new Error("Error al obtener usuarios");
    return res.json();
  },

  async getById(id: number): Promise<User> {
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
  }
};