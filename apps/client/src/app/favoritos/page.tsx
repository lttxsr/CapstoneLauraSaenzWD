/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import EmptyState from "@/components/EmptyState";
import type { BookRef, FavoriteRow } from "@/types";
import RequireAuth from "@/components/RequireAuth";
import styles from "@/styles/components/Favorites.module.css";

export default function FavoritosPage() {
  const [books, setBooks] = useState<BookRef[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const favs = (await api.favorites()) as FavoriteRow[];
      setBooks(
        favs.map((f) => ({
          id: f.bookId,
          title: f.title,
          author: f.author ?? undefined,
          coverUrl: f.coverUrl ?? undefined,
          year: f.year ?? undefined,
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  const remove = async (bookId: string) => {
    if (!confirm("¿Seguro que quieres eliminar este libro de tus favoritos?")) return;
    try {
      await api.removeFavorite(bookId);
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
    } catch (err) {
      console.error("Error al eliminar favorito:", err);
      alert("No se pudo eliminar el favorito.");
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <RequireAuth>
      {!books.length ? (
        <EmptyState
          title="Sin favoritos aún"
          subtitle="Añade libros a tu lista de favoritos para verlos aquí."
        />
      ) : (
        <div className={styles.page}>
          <h2 className={styles.title}>Tus Favoritos</h2>

          <div className={styles.grid}>
            {books.map((b) => (
              <div key={b.id} className={styles.card}>
                <button
                  className={styles.remove}
                  onClick={() => remove(b.id)}
                  aria-label="Eliminar de favoritos"
                >
                  ✕
                </button>

                {b.coverUrl ? (
                  <img src={b.coverUrl} alt={b.title} className={styles.cover} />
                ) : (
                  <div className={styles.coverPlaceholder}>Sin portada</div>
                )}

                <div className={styles.meta}>
                  <div className={styles.bookTitle}>{b.title}</div>
                  <div className={styles.author}>{b.author || "Autor desconocido"}</div>
                  <div className={styles.year}>Año: {b.year || "N/A"}</div>
                </div>

                <button
                  className="btn btn-primary btn-sm w-full mt-2"
                  onClick={async () => {
                    try {
                      await api.createLoan(b);
                      alert("Préstamo creado correctamente.");
                    } catch (err) {
                      console.error("Error creando préstamo:", err);
                      alert("No se pudo crear el préstamo.");
                    }
                  }}
                >
                  Pedir
                </button>
              </div>
            ))}
          </div>

          {loading && <div className={styles.loading}>Cargando...</div>}
        </div>
      )}
    </RequireAuth>
  );
}
