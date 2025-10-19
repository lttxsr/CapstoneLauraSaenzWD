/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import type { BookRef } from "@/types";
import styles from "@/styles/components/BorrowDialog.module.css";

interface BorrowDialogProps {
  book: BookRef | null;
  onClose: () => void;
  onDone?: () => void;
}

export default function BorrowDialog({ book, onClose, onDone }: BorrowDialogProps) {
  const [days, setDays] = useState(14);
  const [loading, setLoading] = useState(false);

  if (!book) return null;

  const confirm = async () => {
    setLoading(true);
    try {
      await api.createLoan(book, days);
      onDone?.();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <aside className={styles.panel} onClick={(e) => e.stopPropagation()}>

        <div className={styles.header}>
          <h2 className={styles.title}>Pedir préstamo</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="text-slate-500 hover:text-slate-700 text-lg"
          >
            ✕
          </button>
        </div>

        <div className={styles.cover}>
          {book.coverUrl ? (
            <img src={book.coverUrl} alt={book.title} />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">
              Sin portada
            </div>
          )}
        </div>

        <div className={styles.bookInfo}>
          <h3>{book.title}</h3>
          <p>{book.author || "Autor desconocido"}</p>
        </div>

        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="days">Duración (días)</label>
          <input
            id="days"
            type="number"
            min={1}
            max={30}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          />
        </form>

        <div className={styles.actions}>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn btn-primary"
            onClick={confirm}
            disabled={loading}
          >
            {loading ? "Creando..." : "Confirmar"}
          </button>
        </div>
      </aside>
    </div>
  );
}
