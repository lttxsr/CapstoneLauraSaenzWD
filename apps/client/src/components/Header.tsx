"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SearchBar from "./SearchBar";
import { useAuth } from "@/context/AuthContext";
import styles from "@/styles/components/Header.module.css";

const tabs = [
  { href: "/", label: "INICIO" },
  { href: "/categorias", label: "CATEGORÍAS" },
  { href: "/favoritos", label: "FAVORITOS" },
  { href: "/prestamos", label: "PRÉSTAMOS" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const sp = useSearchParams();
  const q = sp.get("q") ?? "";
  const { user, logout } = useAuth();

  return (
    <header className="site">
      <div className="container-page h-full flex items-center gap-4">
        <Link href="/" className="font-black tracking-wide text-white text-lg">
          Biblio<span className="text-white/80">UNI</span>
        </Link>

        <nav className={styles.nav}>
          {tabs.map(t => (
            <Link
              key={t.href}
              href={t.href}
              className={`${styles.link} ${pathname === t.href ? styles.active : ""}`}
            >
              {t.label}
            </Link>
          ))}
        </nav>

        <div className={styles.spacer} />

        <div className={styles.search}>
          <SearchBar
            defaultValue={q}
            onSearch={(v)=> router.push(`/?q=${encodeURIComponent(v)}`)}
          />
        </div>

        <div className={styles.authBtn}>
          {user ? (
            <button className="btn btn-ghost" onClick={logout}>Salir</button>
          ) : (
            <Link className="btn btn-ghost" href="/login">Entrar</Link>
          )}
        </div>
      </div>
    </header>
  );
}
