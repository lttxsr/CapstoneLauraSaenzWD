"use client";

import { Suspense } from "react";
import Link from "next/link";

function NotFoundContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-6">
      <div className="text-8xl">😕</div>
      <h1 className="text-3xl font-bold">Página no encontrada</h1>
      <p className="text-slate-600">
        Lo sentimos, no pudimos encontrar la página que buscas.
      </p>
      <Link
        href="/"
        className="btn btn-primary mt-4 inline-block px-6 py-2 rounded-lg"
      >
        Volver al inicio
      </Link>
    </div>
  );
}

export default function NotFoundPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Cargando...</div>}>
      <NotFoundContent />
    </Suspense>
  );
}
