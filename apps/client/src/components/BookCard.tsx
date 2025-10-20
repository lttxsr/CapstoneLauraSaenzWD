/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import Link from "next/link";
import type { BookRef } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import BorrowDialog from "@/components/BorrowDialog";
import { api } from "@/lib/api";
import styles from "@/styles/components/BookCard.module.css";

type Props = {
  book: BookRef;
  hideFavoriteButton?: boolean;
};

export default function BookCard({ book, hideFavoriteButton = false }: Props) {
  const { token } = useAuth();
  const router = useRouter();
  const [loadingFav, setLoadingFav] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [imageError, setImageError] = useState(false);

  const guard = (fn: () => void) => (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!token) {
      const url =
        typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : "/";
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
        <Link
          href={`/libro/${encodeURIComponent(book.id)}`}
          className={styles.media}
          aria-label={`Ver detalles de ${book.title}`}
        >
          {book.coverUrl && !imageError ? (
            <img
              src={book.coverUrl}
              alt={`Portada de ${book.title}`}
              className={styles.mediaImg}
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className={styles.placeholder}>
              <span>
                :/<br />Sin portada
              </span>
            </div>
          )}
        </Link>

        <div className={styles.info}>
          <h3 className={styles.title}>{book.title}</h3>
          <p className={styles.author}>{book.author || "Autor desconocido"}</p>
          {book.year && (
            <p className={styles.year}>Año: {book.year}</p>
          )}
        </div>

        <div className={styles.actions}>
          {!hideFavoriteButton && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={addFav}
              disabled={loadingFav}
              aria-busy={loadingFav}
            >
              {loadingFav ? "Añadiendo…" : "Favoritos"}
            </button>
          )}

          <button
            className="btn btn-primary btn-sm"
            onClick={guard(() => setShowDialog(true))}
          >
            Pedir
          </button>

          <Link
            href={`/libro/${encodeURIComponent(book.id)}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="btn btn-ghost btn-sm">Detalles</button>
          </Link>
        </div>
      </article>

      {showDialog && (
        <BorrowDialog
          book={book}
          onClose={() => setShowDialog(false)}
          onDone={() => setShowDialog(false)}
        />
      )}
    </>
  );
}
