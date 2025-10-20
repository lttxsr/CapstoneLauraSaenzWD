"use client";
import { useEffect, useRef, useState } from "react";

export default function SearchBar({ defaultValue, onSearch }: { defaultValue?: string | null; onSearch: (v: string)=>void }) {
  const [v, setV] = useState(defaultValue ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setV(defaultValue ?? ""), [defaultValue]);

  return (
    <form onSubmit={(e)=> { e.preventDefault(); onSearch(v); }} className="flex gap-2">
      <input
        ref={inputRef}
        className="input"
        placeholder="Buscar..."
        value={v}
        onChange={e=>setV(e.target.value)}
        aria-label="Buscar libros"
      />
      <button type="submit" className="btn btn-primary">🔍︎</button>
    </form>
  );
}
