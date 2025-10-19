/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import type { BookRef } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import BorrowDialog from "@/components/BorrowDialog";
import { api } from "@/lib/api";
import styles from "@/styles/components/BookCard.module.css";

export default function BookCard({ book }: { book: BookRef }) {
  const { token } = useAuth();
  const router = useRouter();
  const [loadingFav, setLoadingFav] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const guard = (fn: () => void) => () => {
    if (!token) {
      const url = typeof window !== "undefined"
        ? window.location.pathname + window.location.search : "/";
      router.push(`/login?next=${encodeURIComponent(url)}`);
      return;
    }
    fn();
  };

  const addFav = guard(async () => {
    setLoadingFav(true);
    try {
      await api.addFavorite(book);
    } finally {
      setLoadingFav(false);
    }
  });

  return (
    <>
      <article className={styles.card}>
        <button
          className={styles.media}
          onClick={() => setShowDialog(true)}
          aria-label={`Pedir ${book.title}`}
        >
          {book.coverUrl ? (
            <img src={book.coverUrl} alt={book.title} className={styles.mediaImg} />
          ) : (
            <div className={styles.placeholder}><span>Sin portada</span></div>
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
            disabled={loadingFav}
          >
            {loadingFav ? "Añadiendo…" : "Favoritos"}
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={guard(() => setShowDialog(true))}
          >
            Pedir
          </button>
        </div>
      </article>

      {showDialog && (
        <BorrowDialog
          book={book}
          onClose={() => setShowDialog(false)}
          onDone={() => {
            setShowDialog(false);
          }}
        />
      )}
    </>
  );
}
