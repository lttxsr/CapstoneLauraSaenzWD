import type { BookRef } from "@/types";

const API = process.env.NEXT_PUBLIC_API_BASE!;

type SearchResult = { total: number; books: BookRef[] };

type OLDoc = {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
};
type OLSubjectWork = {
  key: string;
  title: string;
  authors?: { name: string }[];
  cover_id?: number;
  first_publish_year?: number;
};

function authHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth:token") : null;
  const h: Record<string, string> = {};
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

function jsonHeaders(): HeadersInit {
  return { "Content-Type": "application/json", ...(authHeaders() as Record<string, string>) };
}

function coverUrlFromOL(cover_i?: number | null): string | null {
  return cover_i ? `https://covers.openlibrary.org/b/id/${cover_i}-L.jpg` : null;
}

export const api = {
  async search(q: string, page = 1): Promise<SearchResult> {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&page=${page}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Error buscando libros");
    const data: { docs: OLDoc[]; numFound?: number } = await res.json();
    const books: BookRef[] = (data.docs || []).slice(0, 40).map((d) => ({
      id: d.key,
      title: d.title,
      author: d.author_name?.[0] || "",
      coverUrl: coverUrlFromOL(d.cover_i),
      year: d.first_publish_year ?? null,
    }));
    return { total: data.numFound || books.length, books };
  },

  async category(subject: string, page = 1): Promise<SearchResult> {
    const url = `https://openlibrary.org/subjects/${encodeURIComponent(subject)}.json?limit=40&offset=${(page - 1) * 40}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Error obteniendo categoría");
    const data: { works: OLSubjectWork[]; work_count?: number } = await res.json();
    const books: BookRef[] = (data.works || []).map((w) => ({
      id: w.key,
      title: w.title,
      author: w.authors?.[0]?.name || "",
      coverUrl: coverUrlFromOL(w.cover_id ?? null),
      year: w.first_publish_year ?? null,
    }));
    return { total: data.work_count || books.length, books };
  },

  async favorites() {
    const r = await fetch(`${API}/api/favorites`, { headers: authHeaders(), cache: "no-store" });
    if (r.status === 401) throw new Error("No autenticado");
    if (!r.ok) throw new Error("Error al listar favoritos");
    return r.json();
  },

  async addFavorite(book: BookRef) {
    const r = await fetch(`${API}/api/favorites`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify({
        id: book.id,
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
        year: book.year,
      }),
    });
    if (r.status === 401) throw new Error("No autenticado");
    if (!r.ok) throw new Error("No se pudo guardar favorito");
    return r.json();
  },

  async removeFavorite(bookId: string) {
    const r = await fetch(`${API}/api/favorites?bookId=${encodeURIComponent(bookId)}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (r.status === 401) throw new Error("No autenticado");
    if (!r.ok) throw new Error("No se pudo eliminar favorito");
    return r.json();
  },

  async loans() {
    const r = await fetch(`${API}/api/loans`, { headers: authHeaders(), cache: "no-store" });
    if (r.status === 401) throw new Error("No autenticado");
    if (!r.ok) throw new Error("Error al listar préstamos");
    return r.json();
  },

  async createLoan(book: BookRef, days = 14) {
    const r = await fetch(`${API}/api/loans`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify({
        id: book.id,
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
        year: book.year,
        days,
      }),
    });
    if (r.status === 401) throw new Error("No autenticado");
    if (!r.ok) throw new Error("No se pudo crear préstamo");
    return r.json();
  },

  async returnLoan(id: string) {
    const r = await fetch(`${API}/api/loans?id=${encodeURIComponent(id)}&action=return`, {
      method: "PATCH",
      headers: authHeaders(),
    });
    if (r.status === 401) throw new Error("No autenticado");
    if (!r.ok) throw new Error("No se pudo devolver préstamo");
    return r.json();
  },
};
