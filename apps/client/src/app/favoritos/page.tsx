"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import BookGrid from "@/components/BookGrid";
import EmptyState from "@/components/EmptyState";
import type { BookRef, FavoriteRow } from "@/types";
import RequireAuth from "@/components/RequireAuth";

export default function FavoritosPage() {
  const [books, setBooks] = useState<BookRef[]>([]);

  const refresh = async () => {
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
  };

  useEffect(() => { refresh(); }, []);

  return (
    <RequireAuth>
      {!books.length ? (
        <EmptyState title="Sin favoritos aún" subtitle="Añade libros a tu lista de favoritos para verlos aquí." />
      ) : (
        <div className="space-y-3">
          <h2 className="text-lg font-bold">Tus Favoritos</h2>
          <BookGrid books={books} onOpen={() => {}} />
        </div>
      )}
    </RequireAuth>
  );
}
