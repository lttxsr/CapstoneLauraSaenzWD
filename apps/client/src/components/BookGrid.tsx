"use client";
import BookCard from "./BookCard";
import type { BookRef } from "@/types";
import gridStyles from "@/styles/components/BookGrid.module.css";

interface BookGridProps {
  books: BookRef[];
  hideFavoriteButton?: boolean;
  onOpen?: (book: BookRef) => void;
}

export default function BookGrid({
  books,
  hideFavoriteButton = false,
  onOpen,
}: BookGridProps) {
  if (!books.length) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🙁</div>
        <h3 className="text-lg font-semibold text-slate-700">
          No hay libros encontrados
        </h3>
        <p className="text-slate-500 mt-2">
          Intenta con otros términos de búsqueda
        </p>
      </div>
    );
  }

  return (
    <div className={gridStyles.grid}>
      {books.map((b) => (
        <div
          key={b.id}
          onClick={() => onOpen?.(b)}
          className="cursor-pointer"
        >
          <BookCard book={b} hideFavoriteButton={hideFavoriteButton} />
        </div>
      ))}
    </div>
  );
}
