"use client";

import { Suspense, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";

function LoginContent() {
  const { login } = useAuth();
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login({ email, password });
      router.push(next);
    } catch {
      setErr("Email o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto card p-6">
      <h1 className="text-xl font-bold mb-2">Iniciar sesión</h1>
      <p className="text-sm text-slate-600 mb-4">
        Ingresa con tu cuenta para gestionar favoritos y préstamos.
      </p>

      <form onSubmit={submit} className="space-y-3">
        <input
          className="input"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="input"
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {err && <div className="text-rose-600 text-sm">{err}</div>}

        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>

      <div className="text-sm text-slate-600 mt-3">
        ¿No tienes cuenta?{" "}
        <a href="/register" className="link">
          Regístrate
        </a>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Cargando formulario de inicio…</div>}>
      <LoginContent />
    </Suspense>
  );
}
