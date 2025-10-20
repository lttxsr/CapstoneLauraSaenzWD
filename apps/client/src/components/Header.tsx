"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
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

  const [hydrated, setHydrated] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpenMenu(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleNavClick = (href: string) => {
    router.push(href);
    setOpenMenu(false);
  };

  return (
    <header className="site bg-[var(--color-header)] text-white shadow-sm relative z-30">
      <div className="container-page flex items-center gap-4 py-3 px-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="font-black tracking-wide text-white text-lg sm:text-xl"
            onClick={() => setOpenMenu(false)}
          >
            Biblio<span className="text-white/80">UNI</span>
          </Link>

          <nav className={`${styles.nav} hidden md:flex`}>
            {tabs.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className={`${styles.link} ${pathname === t.href ? styles.active : ""}`}
              >
                {t.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className={`${styles.centerSearch} flex-1 flex justify-center`}>
          <SearchBar
            defaultValue={q}
            onSearch={(v) => router.push(`/?q=${encodeURIComponent(v)}`)}
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {hydrated && user ? (
            <button className="hidden md:block btn btn-ghost text-white" onClick={logout}>
              Salir
            </button>
          ) : hydrated ? (
            <Link className="hidden md:block btn btn-ghost text-white" href="/login">
              Entrar
            </Link>
          ) : (
            <div className="hidden md:block w-[72px] h-[36px]" />
          )}

          <button
            className={`${styles.menuBtn} md:hidden`}
            onClick={() => setOpenMenu((v) => !v)}
            aria-label="Menú"
          >
            {openMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {openMenu && (
        <div className={styles.mobileMenu}>
          <nav className="flex flex-col gap-2 px-4 py-3">
            {tabs.map((t) => (
              <button
                key={t.href}
                onClick={() => handleNavClick(t.href)}
                className={`text-left px-3 py-2 rounded-md font-medium ${
                  pathname === t.href ? "bg-white/15" : "hover:bg-white/10 text-white/90"
                }`}
              >
                {t.label}
              </button>
            ))}
            <div className="mt-2 border-t border-white/10 pt-2">
              {hydrated && user ? (
                <button
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-white/10"
                  onClick={logout}
                >
                  Salir
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpenMenu(false)}
                  className="block px-3 py-2 rounded-md hover:bg-white/10"
                >
                  Entrar
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
