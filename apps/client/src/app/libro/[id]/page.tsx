/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import BorrowDialog from "@/components/BorrowDialog";
import type { ReadingRow, ReadingState, BookRef } from "@/types";
import styles from "@/styles/components/BookDetails.module.css";

type Work = {
  key: string;
  title: string;
  description?: string | { value: string };
  covers?: number[];
  subjects?: string[];
  first_publish_date?: string;
  authors?: { author: { key: string } }[];
};

type Author = { name: string };

const STATES: { value: ReadingState; label: string }[] = [
  { value: "READING", label: "Leyendo" },
  { value: "COMPLETED", label: "Completado" },
  { value: "WISHLIST", label: "Lista de deseos" },
  { value: "NONE", label: "Sin estado" },
];

function coverUrl(id?: number | null) {
  return id ? `https://covers.openlibrary.org/b/id/${id}-L.jpg` : null;
}
function normalizeDescription(d?: string | { value: string }): string {
  if (!d) return "";
  return typeof d === "string" ? d : d.value || "";
}
function yearFrom(dateStr?: string | null): number | null {
  if (!dateStr) return null;
  const y = parseInt(dateStr.slice(0, 4), 10);
  return Number.isFinite(y) ? y : null;
}

export default function BookDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { token } = useAuth();
  const id = decodeURIComponent(params.id);

  const [work, setWork] = useState<Work | null>(null);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [reading, setReading] = useState<ReadingRow | null>(null);
  const [busy, setBusy] = useState(false);
  const [showBorrow, setShowBorrow] = useState(false);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch(`https://openlibrary.org${id}.json`, { cache: "no-store" });
      if (!res.ok) return;
      const w: Work = await res.json();
      setWork(w);

      const keys = (w.authors || []).map((a) => a.author.key).slice(0, 3);
      const fetched: Author[] = [];
      for (const k of keys) {
        const ar = await fetch(`https://openlibrary.org${k}.json`, { cache: "no-store" });
        if (ar.ok) fetched.push(await ar.json());
      }
      setAuthors(fetched);
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      try {
        const r = await api.getReading(id);
        setReading(r);
      } catch {
        setReading({ userId: "", bookId: id, status: "NONE" });
      }
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      try {
        const favs = await api.favorites();
        setIsFav((favs as any[]).some((f) => f.bookId === id));
      } catch {
        setIsFav(false);
      }
    })();
  }, [id]);

  const img = useMemo(() => coverUrl(work?.covers?.[0] ?? null), [work]);
  const authorNames = authors.map((a) => a.name).join(", ");
  const desc = normalizeDescription(work?.description);

  const bookRef: BookRef | null = useMemo(() => {
    if (!work) return null;
    return {
      id,
      title: work.title,
      author: authorNames || "",
      coverUrl: img || undefined,
      year: yearFrom(work.first_publish_date),
    };
  }, [work, id, authorNames, img]);

  const guard = (fn: () => void) => () => {
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

  const toggleFavorite = guard(async () => {
    if (!bookRef) return;
    setBusy(true);
    try {
      if (isFav) {
        await api.removeFavorite(bookRef.id);
        if (reading?.status === "WISHLIST") {
          const r = await api.setReading(bookRef.id, "NONE");
          setReading(r);
        }
        setIsFav(false);
      } else {
        await api.addFavorite(bookRef);
        const r = await api.setReading(bookRef.id, "WISHLIST");
        setReading(r);
        setIsFav(true);
      }
    } finally {
      setBusy(false);
    }
  });

  const updateStatus = async (s: ReadingState) => {
    if (!bookRef) return;
    setBusy(true);
    try {
      if (s === "WISHLIST" && !isFav) {
        await api.addFavorite(bookRef);
        setIsFav(true);
      }
      if (reading?.status === "WISHLIST" && s !== "WISHLIST" && isFav) {
        await api.removeFavorite(bookRef.id);
        setIsFav(false);
      }
      const r = await api.setReading(id, s);
      setReading(r);
    } finally {
      setBusy(false);
    }
  };

  if (!work) {
    return (
      <div className="container-page main-content">
        <div className="text-center p-6">Cargando…</div>
      </div>
    );
  }

  return (
    <div className="container-page main-content">
      <div className={styles.backRow}>
        <button className="btn btn-ghost btn-sm" onClick={() => router.back()}>
          Volver
        </button>
      </div>

      <div className={`card ${styles.card}`}>
        <div className={styles.cover}>
          {img ? <img src={img} alt={work.title} /> : <div className={styles.coverPh} />}
        </div>

        <div className={styles.meta}>
          <h1 className={styles.title}>{work.title}</h1>
          {authorNames ? <p className={styles.author}>{authorNames}</p> : null}
          {work.first_publish_date ? <p className={styles.subtle}>Publicado: {work.first_publish_date}</p> : null}

          <div className={styles.actions}>
            <button
              className={`btn btn-sm ${isFav ? "btn-primary" : "btn-ghost"}`}
              onClick={toggleFavorite}
              disabled={busy || !bookRef}
              aria-pressed={isFav}
              title={isFav ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              {isFav ? "❤️ Favoritos" : "♡ Favoritos"}
            </button>

            <button
              className="btn btn-primary btn-sm"
              onClick={guard(() => setShowBorrow(true))}
            >
              Pedir libro
            </button>
          </div>

          <div className={styles.stateRow}>
            {STATES.map((s) => {
              const active = reading?.status === s.value;
              return (
                <button
                  key={s.value}
                  className={`btn btn-sm ${active ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => updateStatus(s.value)}
                  disabled={busy}
                >
                  {s.label}
                </button>
              );
            })}
          </div>

          {desc ? <p className={styles.desc}>{desc}</p> : null}

          {work.subjects?.length ? (
            <div className={styles.tags}>
              {work.subjects.slice(0, 16).map((t) => (
                <span key={t} className={styles.tag}>{t}</span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {showBorrow && bookRef && (
        <BorrowDialog
          book={bookRef}
          onClose={() => setShowBorrow(false)}
          onDone={() => setShowBorrow(false)}
        />
      )}
    </div>
  );
}
