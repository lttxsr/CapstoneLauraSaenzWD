/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import EmptyState from "@/components/EmptyState";
import type { Loan } from "@/types";
import { format } from "date-fns";
import RequireAuth from "@/components/RequireAuth";

export default function PrestamosPage() {
  const [loans, setLoans] = useState<Loan[]>([]);

  const refresh = async () => {
    const r = await api.loans();
    setLoans(r as Loan[]);
  };

  useEffect(() => { refresh(); }, []);

  return (
    <RequireAuth>
      {!loans.length ? (
        <EmptyState title="No tienes préstamos activos" subtitle="Pide prestado un libro desde el catálogo." />
      ) : (
        <div className="space-y-3">
          <h2 className="text-lg font-bold">Tus Préstamos</h2>
          <div className="grid gap-3">
            {loans.map((l) => (
              <div key={l.id} className="card flex items-center gap-4">
                <div className="rounded-xl overflow-hidden bg-slate-200 w-16 h-20 shrink-0">
                  {l.coverUrl ? <img src={l.coverUrl} alt={l.title} className="w-full h-full object-cover" /> : null}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{l.title}</div>
                  <div className="text-sm text-slate-600">{l.author || "Autor desconocido"}</div>
                  <div className="text-sm mt-1">Vence: <b>{format(new Date(l.due), "yyyy-MM-dd")}</b></div>
                  {l.returned && <div className="text-xs mt-1 text-emerald-700">Devuelto</div>}
                </div>
                {!l.returned && (
                  <button className="btn-primary" onClick={async ()=> { await api.returnLoan(l.id); refresh(); }}>
                    Devolver
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </RequireAuth>
  );
}
