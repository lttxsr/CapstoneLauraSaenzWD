"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/lib/toast";

type Props = { children: React.ReactNode };

export default function RequireAuth({ children }: Props) {
  const { token } = useAuth();
  const router = useRouter();
  const didToastRef = useRef(false);

  const nextUrl = useMemo(() => {
    if (typeof window === "undefined") return "/";
    return window.location.pathname + window.location.search;
  }, []);

  useEffect(() => {
    if (!token && !didToastRef.current) {
      toast.once("Debes iniciar sesión o registrarte para continuar.", "error");
      didToastRef.current = true;
    }
  }, [token]);

  if (!token) {
    return (
      <div className="container-page main-content">
        <div
          className="card"
          style={{
            maxWidth: 520,
            margin: "2rem auto",
            textAlign: "center",
            padding: "1.25rem",
          }}
        >
          <div style={{ fontSize: "2.25rem", marginBottom: "0.5rem" }}>🔒</div>
          <h2 className="text-lg font-bold" style={{ marginBottom: ".25rem" }}>
            Autenticación requerida
          </h2>
          <p className="text-slate-600" style={{ marginBottom: "1rem" }}>
            Para acceder a esta sección, por favor inicia sesión o crea una
            cuenta.
          </p>

          <div style={{ display: "flex", gap: ".5rem", justifyContent: "center" }}>
            <button
              className="btn btn-ghost"
              onClick={() => router.push(`/register?next=${encodeURIComponent(nextUrl)}`)}
            >
              Registrarme
            </button>
            <button
              className="btn btn-primary"
              onClick={() => router.push(`/login?next=${encodeURIComponent(nextUrl)}`)}
            >
              Iniciar sesión
            </button>
          </div>

          <p className="text-xs text-slate-500" style={{ marginTop: ".75rem" }}>
            Serás redirigido después de autenticarte.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
