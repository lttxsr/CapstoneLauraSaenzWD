"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import BookGrid from "@/components/BookGrid";
import BookModal from "@/components/BookModal";
import type { BookRef } from "@/types";

export default function HomePage() {
  const sp = useSearchParams();
  const q = sp.get("q");
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState<BookRef[]>([]);
  const [featured, setFeatured] = useState<BookRef[]>([]);
  const [sel, setSel] = useState<BookRef | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const query = q && q.trim().length ? q : "javascript";
      try {
        const r = await api.search(query, 1);
        if (active) setBooks(r.books);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [q]);

  useEffect(() => {
    (async () => {
      const r = await api.search("web development", 1);
      setFeatured(r.books.slice(0, 8));
    })();
  }, []);

  const title = useMemo(() => (q ? `Resultados para "${q}"` : "Para ti"), [q]);

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-lg font-bold">{title}</h2>
        {loading ? <div className="text-slate-500">Cargando…</div> : <BookGrid books={books} onOpen={setSel} />}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Recomendados</h2>
        <BookGrid books={featured} onOpen={setSel} />
      </section>

      <BookModal book={sel} onClose={() => setSel(null)} />
    </div>
  );
}
