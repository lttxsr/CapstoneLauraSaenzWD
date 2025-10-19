"use client";
export default function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="card p-8 text-center">
      <div className="text-5xl mb-3">😯</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {subtitle && <p className="text-slate-600 mt-2">{subtitle}</p>}
    </div>
  );
}
