
"use client";
import BookCard from "./BookCard";
import type { BookRef } from "@/types";
import gridStyles from "@/styles/components/BookGrid.module.css";

export default function BookGrid({ books, onOpen }: { books: BookRef[]; onOpen?: (b: BookRef)=>void }) {
  if (!books.length) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">:c</div>
        <h3 className="text-lg font-semibold text-slate-700">No hay libros encontrados</h3>
        <p className="text-slate-500 mt-2">Intenta con otros términos de búsqueda</p>
      </div>
    );
  }

  return (
    <div className={gridStyles.grid}>
      {books.map(b => <BookCard key={b.id} book={b} onOpen={onOpen} />)}
    </div>
  );
}
