"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type User = { id: string; email: string; name?: string | null };
type LoginPayload = { email: string; password: string };
type RegisterPayload = { name?: string; email: string; password: string };

type AuthCtxType = {
  token: string | null;
  user: User | null;
  login: (p: LoginPayload) => Promise<void>;
  register: (p: RegisterPayload) => Promise<void>;
  logout: () => void;
};

const API = process.env.NEXT_PUBLIC_API_BASE!;
const AuthCtx = createContext<AuthCtxType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("auth:token");
    const u = localStorage.getItem("auth:user");
    if (t) setToken(t);
    if (u) setUser(JSON.parse(u));
  }, []);

  const login = async ({ email, password }: LoginPayload) => {
    const r = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!r.ok) throw new Error("Credenciales inválidas");
    const j = await r.json();
    setToken(j.token);
    setUser(j.user);
    localStorage.setItem("auth:token", j.token);
    localStorage.setItem("auth:user", JSON.stringify(j.user));
  };

  const register = async (p: RegisterPayload) => {
    const r = await fetch(`${API}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p)
    });
    if (!r.ok) throw new Error("No se pudo registrar");
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth:token");
    localStorage.removeItem("auth:user");
  };

  const value = useMemo(() => ({ token, user, login, register, logout }), [token, user]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
