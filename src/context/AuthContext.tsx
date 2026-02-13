/**
 * AuthContext
 * 
 * Contexto global de autenticación para la aplicación.
 * - Proporciona el usuario autenticado.
 * - Permite iniciar y cerrar sesión.
 * - Guarda el usuario en localStorage para persistencia.
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { userService } from "../services/userServices";
import type { User } from "../types/user";

// Interfaz del valor que provee el contexto de autenticación
interface AuthContextValue {
  user: User | null;
  error: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  findUserByEmail: (email: string) => Promise<User | null>;
}

// Crea el contexto de autenticación
const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = "auth:user";

/**
 * Proveedor del contexto de autenticación.
 * - Mantiene el usuario autenticado y su persistencia en localStorage.
 * - Proporciona funciones para login, logout y búsqueda de usuario.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Al montar, intenta cargar el usuario guardado en localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as User;
        setUser(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  /**
   * Inicia sesión con email y contraseña.
   * - Si las credenciales son correctas, guarda el usuario en estado y localStorage.
   * - Si no, muestra error y limpia el usuario.
   */
  const login = async (email: string, password: string) => {
    setError(null);
    const found = await userService.getByEmail(email);
    if (!found || found.password !== password) {
      setError("Credenciales incorrectas");
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
      return false;
    }
    setUser(found);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
    return true;
  };

  /**
   * Cierra la sesión y limpia el usuario y el error.
   */
  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  /**
   * Busca un usuario por email.
   */
  const findUserByEmail = async (email: string) => {
    return await userService.getByEmail(email);
  };

  // Provee el contexto a los hijos
  return (
    <AuthContext.Provider
      value={{ user, error, loading, login, logout, findUserByEmail }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook para consumir el contexto de autenticación.
 * - Lanza error si se usa fuera del AuthProvider.
 */
export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext debe usarse dentro de AuthProvider");
  return ctx;
}