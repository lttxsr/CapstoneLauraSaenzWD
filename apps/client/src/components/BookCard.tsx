"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { BookRef } from "@/types";
import { useAuth } from "@/context/AuthContext";
import styles from "@/styles/components/BookCard.module.css";

export default function BookCard({
  book,
  onOpen,
}: { book: BookRef; onOpen?: (b: BookRef)=>void }) {
  const [loadingFav, setLoadingFav] = useState(false);
  const [loadingLoan, setLoadingLoan] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { token } = useAuth();
  const router = useRouter();

  const guard = (fn: () => Promise<void>) => async () => {
    if (!token) {
      const url = typeof window !== "undefined"
        ? window.location.pathname + window.location.search : "/";
      router.push(`/login?next=${encodeURIComponent(url)}`);
      return;
    }
    await fn();
  };

  const addFav = guard(async () => { try { setLoadingFav(true); await api.addFavorite(book); } finally { setLoadingFav(false); } });
  const loan   = guard(async () => { try { setLoadingLoan(true); await api.createLoan(book, 14); } finally { setLoadingLoan(false); } });

  return (
    <article className={styles.card}>
      <button
        className={styles.media}
        onClick={() => onOpen?.(book)}
        aria-label={`Ver detalles de ${book.title}`}
      >
        {book.coverUrl && !imageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.coverUrl}
            alt={`Portada de ${book.title}`}
            className={styles.mediaImg}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className={styles.placeholder}><span>:/<br/>Sin portada</span></div>
        )}
      </button>

      <div className={styles.info}>
        <h3 className={styles.title}>{book.title}</h3>
        <p className={styles.author}>{book.author || "Autor desconocido"}</p>
        {book.year && <p className="text-xs text-slate-500 mt-1">Año: {book.year}</p>}
      </div>

      <div className={styles.actions}>
        <button
          className="btn btn-ghost btn-sm"
          onClick={addFav}
          disabled={loadingFav || loadingLoan}
          aria-busy={loadingFav}
        >
          {loadingFav ? "Añadiendo…" : "Favoritos"}
        </button>
        <button
          className="btn btn-primary btn-sm"
          onClick={loan}
          disabled={loadingLoan || loadingFav}
          aria-busy={loadingLoan}
        >
          {loadingLoan ? "Pidiendo…" : "Pedir"}
        </button>
      </div>
    </article>
  );
}
