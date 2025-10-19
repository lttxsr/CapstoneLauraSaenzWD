"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import BookGrid from "@/components/BookGrid";
import BookModal from "@/components/BookModal";
import type { BookRef } from "@/types";
import chipStyles from "@/styles/components/CategoryChips.module.css";

const CATS = [
  { k: "science_fiction", label: "Ciencia Ficción" },
  { k: "history", label: "Historia" },
  { k: "fantasy", label: "Fantasía" },
  { k: "romance", label: "Romance" },
  { k: "biographies", label: "Biografías" },
];

export default function CategoriasPage() {
  const [selCat, setSelCat] = useState(CATS[0].k);
  const [books, setBooks] = useState<BookRef[]>([]);
  const [sel, setSel] = useState<BookRef | null>(null);

  useEffect(() => {
    (async () => {
      const r = await api.category(selCat);
      setBooks(r.books);
    })();
  }, [selCat]);

  return (
    <div className="space-y-6">
      <div className={chipStyles.wrap}>
        {CATS.map(c => (
          <button
            key={c.k}
            className={`${chipStyles.chip} ${c.k === selCat ? chipStyles.active : ""}`}
            onClick={() => setSelCat(c.k)}
            type="button"
          >
            {c.label}
          </button>
        ))}
      </div>
      <BookGrid books={books} onOpen={setSel} />
      <BookModal book={sel} onClose={() => setSel(null)} />
    </div>
  );
}
