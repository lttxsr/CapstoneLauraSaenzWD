/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import EmptyState from "@/components/EmptyState";
import type { Loan, Reservation } from "@/types";
import { format, isPast, differenceInCalendarDays } from "date-fns";
import RequireAuth from "@/components/RequireAuth";
import styles from "@/styles/components/Loans.module.css"; // ← asegúrate de esta ruta

export default function PrestamosPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const ls: Loan[] = await api.loans(true);

      let rs: Reservation[] = [];
      try {
        rs = await api.reservations();
      } catch (e) {
        console.warn("reservations error:", e);
        rs = [];
      }

      setLoans(ls);
      setReservations(rs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const active = useMemo(() => loans.filter(l => !l.returned), [loans]);
  const history = useMemo(() => loans.filter(l => l.returned), [loans]);

  return (
    <RequireAuth>
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className="text-2xl font-bold">Tus Préstamos</h1>
          <p className={styles.subtitle}>Gestiona devoluciones, renovaciones y revisa tus reservas.</p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Activos</h2>
          {!active.length ? (
            <EmptyState title="No tienes préstamos activos" subtitle="Pide prestado un libro desde el catálogo." />
          ) : (
            <div className="grid gap-3">
              {active.map((l) => {
                const due = new Date(l.due);
                const overdue = isPast(due);
                const daysDiff = Math.abs(differenceInCalendarDays(due, new Date()));
                return (
                  <div key={l.id} className={`card ${styles.loanCard}`}>
                    <div className={styles.cover}>
                      {l.coverUrl ? <img src={l.coverUrl} alt={l.title} /> : null}
                    </div>

                    <div className={styles.meta}>
                      <div className={styles.title}>{l.title}</div>
                      <div className={styles.author}>{l.author || "Autor desconocido"}</div>

                      <div className={styles.row}>
                        <span>Vence: <b>{format(due, "yyyy-MM-dd")}</b></span>
                        {overdue ? (
                          <span className={`${styles.badge} ${styles.badgeLate}`}>
                            Atrasado {daysDiff} día{daysDiff === 1 ? "" : "s"}
                          </span>
                        ) : (
                          <span className={`${styles.badge} ${styles.badgeOk}`}>
                            Quedan {daysDiff} día{daysDiff === 1 ? "" : "s"}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={styles.actions}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={async () => {
                          const r = await api.renewLoan(l.id, 7);
                          if (!r.ok && r.reason === "HAS_RESERVATIONS") {
                            alert("No es posible renovar: hay reservas pendientes para este libro.");
                          }
                          await refresh();
                        }}
                      >
                        Renovar +7d
                      </button>

                      <button
                        className="btn btn-primary btn-sm"
                        onClick={async () => {
                          await api.returnLoan(l.id);
                          await refresh();
                        }}
                      >
                        Devolver
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Reservas</h2>
          {!reservations.length ? (
            <div className={styles.emptyText}>No tienes reservas pendientes.</div>
          ) : (
            <div className="grid gap-3">
              {reservations.map((r) => (
                <div key={r.id} className={`card ${styles.loanCard}`}>
                  <div className={styles.cover}>
                    {r.coverUrl ? <img src={r.coverUrl} alt={r.title} /> : null}
                  </div>

                  <div className={styles.meta}>
                    <div className={styles.title}>{r.title}</div>
                    <div className={styles.author}>{r.author || "Autor desconocido"}</div>
                    <div className={styles.row}>
                      <span className={`${styles.badge} ${styles.badgeOk}`}>
                        Tu posición: <b>{r.position}</b>
                      </span>
                      <span className={styles.badge}>
                        Solicitud: {r.requestedDays} días
                      </span>
                    </div>
                  </div>

                  <div className={styles.actions}>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={async () => {
                        await api.cancelReservation(r.id);
                        await refresh();
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Historial</h2>
          {!history.length ? (
            <div className={styles.emptyText}>Aún no tienes historial de préstamos.</div>
          ) : (
            <div className="grid gap-3">
              {history.map((l) => (
                <div key={l.id} className={`card ${styles.loanCard} ${styles.historyMuted}`}>
                  <div className={styles.cover}>
                    {l.coverUrl ? <img src={l.coverUrl} alt={l.title} /> : null}
                  </div>

                  <div className={styles.meta}>
                    <div className={styles.title}>{l.title}</div>
                    <div className={styles.author}>{l.author || "Autor desconocido"}</div>
                    <div className={styles.row}>
                      <span className={`${styles.badge} ${styles.badgeOk}`}>
                        Devuelto {l.returnedAt ? format(new Date(l.returnedAt), "yyyy-MM-dd") : ""}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {loading && <div className={styles.updating}>Actualizando…</div>}
    </RequireAuth>
  );
}
