"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { apiFetch } from "@/lib/api";

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ error?: string; needsVerification?: boolean }>;
  logout: () => Promise<void>;
  setToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({}),
  signup: async () => ({}),
  logout: async () => {},
  setToken: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await apiFetch("/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        localStorage.removeItem("accessToken");
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  async function login(
    email: string,
    password: string
  ): Promise<{ error?: string }> {
    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.message || "Login failed" };

      localStorage.setItem("accessToken", data.accessToken);
      setUser(data.user);
      return {};
    } catch {
      return { error: "Network error" };
    }
  }

  async function signup(
    email: string,
    password: string,
    name: string
  ): Promise<{ error?: string; needsVerification?: boolean }> {
    try {
      const res = await apiFetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.message || "Signup failed" };

      localStorage.setItem("accessToken", data.accessToken);
      setUser(data.user);
      return {};
    } catch {
      return { error: "Network error" };
    }
  }

  async function logout() {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    localStorage.removeItem("accessToken");
    setUser(null);
    window.location.href = "/";
  }

  function setToken(token: string) {
    localStorage.setItem("accessToken", token);
    fetchUser();
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
