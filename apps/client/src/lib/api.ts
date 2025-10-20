import type {
  BookRef,
  Loan,
  CreateLoanResult,
  ReadingRow,
  ReadingState,
} from "@/types";

const RAW = process.env.NEXT_PUBLIC_API_BASE;
if (!RAW) {
   
  console.warn(
    "NEXT_PUBLIC_API_BASE no está definido; usando http://localhost:4000"
  );
}
const API = (RAW || "http://localhost:4000").replace(/\/+$/, "");

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
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth:token") : null;
  const h: Record<string, string> = {};
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

function jsonHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...(authHeaders() as Record<string, string>),
  };
}

function coverUrlFromOL(cover_i?: number | null): string | null {
  return cover_i ? `https://covers.openlibrary.org/b/id/${cover_i}-L.jpg` : null;
}

async function apiFetch(path: string, init?: RequestInit) {
  const url = `${API}${path}`;
  try {
    return await fetch(url, init);
  } catch (err) {
     
    console.error("NETWORK ERROR fetching:", url, init, err);
    throw new Error("No se pudo conectar con el servidor");
  }
}

type FavoriteRow = {
  bookId: string;
  title: string;
  author?: string | null;
  coverUrl?: string | null;
  year?: number | null;
};

export const api = {
  async search(q: string, page = 1): Promise<SearchResult> {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(
      q
    )}&page=${page}`;
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
    const url = `https://openlibrary.org/subjects/${encodeURIComponent(
      subject
    )}.json?limit=40&offset=${(page - 1) * 40}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Error obteniendo categoría");
    const data: { works: OLSubjectWork[]; work_count?: number } =
      await res.json();
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
    const r = await apiFetch(`/api/favorites`, {
      headers: authHeaders(),
      cache: "no-store",
    });
    if (r.status === 401) throw new Error("No autenticado");
    if (!r.ok) throw new Error("Error al listar favoritos");
    return r.json();
  },

  async addFavorite(book: BookRef) {
    const r = await apiFetch(`/api/favorites`, {
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
    const r = await apiFetch(`/api/favorites?bookId=${encodeURIComponent(bookId)}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (r.status === 401) throw new Error("No autenticado");
    if (!r.ok) throw new Error("No se pudo eliminar favorito");
    return r.json();
  },

  async favoritesIds(): Promise<Set<string>> {
    const favs = (await api.favorites()) as FavoriteRow[];
    return new Set(favs.map((f) => f.bookId));
  },

  async isFavorite(bookId: string): Promise<boolean> {
    const ids = await api.favoritesIds();
    return ids.has(bookId);
  },


  async loans(includeHistory = true): Promise<Loan[]> {
    const r = await apiFetch(
      `/api/loans?includeHistory=${includeHistory ? "true" : "false"}`,
      { headers: authHeaders(), cache: "no-store" }
    );
    if (r.status === 401) throw new Error("No autenticado");
    if (!r.ok) throw new Error("Error al listar préstamos");
    return r.json();
  },

  async createLoan(book: BookRef, days = 14): Promise<CreateLoanResult> {
    const r = await apiFetch(`/api/loans`, {
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
    const r = await apiFetch(`/api/loans?id=${encodeURIComponent(id)}&action=return`, {
      method: "PATCH",
      headers: authHeaders(),
    });
    if (r.status === 401) throw new Error("No autenticado");
    if (!r.ok) throw new Error("No se pudo devolver préstamo");
    return r.json();
  },

  async renewLoan(id: string, days = 7) {
    const r = await apiFetch(`/api/loans?id=${encodeURIComponent(id)}&action=renew`, {
      method: "PATCH",
      headers: jsonHeaders(),
      body: JSON.stringify({ days }),
    });
    if (r.status === 401) throw new Error("No autenticado");
    if (!r.ok) throw new Error("No se pudo renovar el préstamo");
    return r.json();
  },

  async reservations() {
    const r = await apiFetch(`/api/reservations`, {
      headers: authHeaders(),
      cache: "no-store",
    });
    if (r.status === 401) throw new Error("No autenticado");
    if (!r.ok) {
      const text = await r.text().catch(() => "");
      console.error("GET /api/reservations FAILED:", r.status, text);
      throw new Error("Error al listar reservas");
    }
    return r.json();
  },

  async cancelReservation(id: string) {
    const r = await apiFetch(`/api/reservations/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (r.status === 401) throw new Error("No autenticado");
    if (!r.ok) {
      const text = await r.text().catch(() => "");
      console.error("DELETE /api/reservations/:id FAILED:", r.status, text);
      throw new Error("No se pudo cancelar la reserva");
    }
    return r.json();
  },

  async getReading(bookId: string): Promise<ReadingRow> {
    const r = await apiFetch(`/api/reading?bookId=${encodeURIComponent(bookId)}`, {
      headers: authHeaders(),
      cache: "no-store",
    });
    if (r.status === 401) throw new Error("No autenticado");
    if (!r.ok) throw new Error("Error al obtener estado de lectura");
    return r.json();
  },

  async setReading(bookId: string, status: ReadingState): Promise<ReadingRow> {
    const r = await apiFetch(`/api/reading`, {
      method: "PUT",
      headers: jsonHeaders(),
      body: JSON.stringify({ bookId, status }),
    });
    if (r.status === 401) throw new Error("No autenticado");
    if (!r.ok) throw new Error("Error al actualizar estado de lectura");
    return r.json();
  },

  async listReading(): Promise<ReadingRow[]> {
    const r = await apiFetch(`/api/reading/list`, {
      headers: authHeaders(),
      cache: "no-store",
    });
    if (r.status === 401) throw new Error("No autenticado");
    if (!r.ok) throw new Error("Error al listar estados de lectura");
    return r.json();
  },

  async setWishlist(
    book: BookRef,
    on: boolean,
    currentState?: ReadingState
  ): Promise<{ fav: boolean; reading: ReadingRow }> {
    if (on) {
      await api.addFavorite(book);
      const reading = await api.setReading(book.id, "WISHLIST");
      return { fav: true, reading };
    } else {
      await api.removeFavorite(book.id);
      const reading =
        (currentState || (await api.getReading(book.id)).status) === "WISHLIST"
          ? await api.setReading(book.id, "NONE")
          : await api.getReading(book.id);
      return { fav: false, reading };
    }
  },

};
