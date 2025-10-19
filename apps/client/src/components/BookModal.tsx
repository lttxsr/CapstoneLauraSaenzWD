"use client";
import type { BookRef } from "@/types";
import Image from "next/image";

export default function BookModal({
  book,
  onClose,
}: {
  book: BookRef | null;
  onClose: () => void;
}) {
  if (!book) return null;
  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="container-page min-h-screen py-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card max-w-3xl mx-auto p-6 grid md:grid-cols-[200px_1fr] gap-6">
          <div className="rounded-xl overflow-hidden bg-slate-200 relative aspect-[3/4]">
            {book.coverUrl ? (
              <Image
                src={book.coverUrl}
                alt={book.title}
                fill
                sizes="(max-width: 768px) 50vw, 200px"
                className="object-cover"
                priority
              />
            ) : null}
          </div>
          <div>
            <h3 className="text-xl font-bold">{book.title}</h3>
            <div className="text-sm text-slate-600">{book.author || "Autor desconocido"}</div>
            {book.year ? (
              <div className="text-sm mt-2">Año: {book.year}</div>
            ) : null}
            <div className="mt-4">
              <button className="btn btn-ghost mr-2" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
