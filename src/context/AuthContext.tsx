import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { userService } from "../services/userServices";
import type { User } from "../types/user";

interface AuthContextValue {
  user: User | null;
  error: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  findUserByEmail: (email: string) => Promise<User | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = "auth:user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const findUserByEmail = async (email: string) => {
    return await userService.getByEmail(email);
  };

  return (
    <AuthContext.Provider
      value={{ user, error, loading, login, logout, findUserByEmail }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext debe usarse dentro de AuthProvider");
  return ctx;
}