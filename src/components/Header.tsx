"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { Logo } from "@/components/Logo";
import { Container } from "@/components/Container";
import { clsx } from "@/lib/clsx";

export function Header({ email = site.email }: { email?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Ferme le menu à chaque changement de page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Blocage du défilement + fermeture par Échap quand le menu est ouvert.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <>
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      {/* Barre supérieure : réassurance vente en ligne */}
      <div className="bg-ink text-[12px] tracking-wide text-[#cfe0e6] sm:text-[12.5px]">
        <Container className="flex h-9 items-center justify-between sm:h-10">
          <a href={`mailto:${email}`} className="truncate hover:text-white">
            <span className="sm:hidden">✉ {email}</span>
            <span className="hidden sm:inline">
              ✉ {email} · Conseil &amp; devis gratuit
            </span>
          </a>
          <span className="hidden sm:block">
            Livraison &amp; installation partout en France
          </span>
        </Container>
      </div>

      {/* Navigation principale */}
      <Container className="flex h-[68px] items-center justify-between lg:h-24">
        {/* Gauche : burger (mobile) + logo */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Ouvrir le menu"
            aria-expanded={open}
            className="-ml-1 flex h-11 w-11 items-center justify-center rounded-xl text-ink transition-colors hover:bg-cream lg:hidden"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Logo className="h-11 w-auto sm:h-14 lg:h-16" />
        </div>

        {/* Centre : navigation desktop */}
        <nav className="hidden items-center gap-8 text-sm lg:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-ink/90 transition-colors hover:text-terra"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Droite : CTA devis */}
        <Link
          href="/devis"
          className="hidden rounded-full bg-terra px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-terra-dark sm:inline-flex"
        >
          Demander un devis
        </Link>
      </Container>
      </header>

      {/* Voile sombre */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={clsx(
          "fixed inset-0 z-40 bg-ink/50 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Menu latéral (depuis la gauche) */}
      <aside
        className={clsx(
          "fixed left-0 top-0 z-50 flex h-full w-[84%] max-w-[340px] flex-col bg-bg shadow-2xl transition-transform duration-300 ease-out lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <Logo className="h-11 w-auto" />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fermer le menu"
            className="flex h-11 w-11 items-center justify-center rounded-xl text-ink transition-colors hover:bg-cream"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={clsx(
                "flex items-center justify-between rounded-xl px-4 py-3.5 text-[17px] transition-colors",
                isActive(item.href)
                  ? "bg-terra/10 font-medium text-terra"
                  : "text-ink hover:bg-cream",
              )}
            >
              {item.label}
              <span className="text-muted">›</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-line px-5 py-5">
          <Link
            href="/devis"
            onClick={() => setOpen(false)}
            className="block rounded-full bg-terra px-6 py-3.5 text-center text-[15px] font-semibold text-white transition-colors hover:bg-terra-dark"
          >
            Demander un devis gratuit
          </Link>
          <a
            href={`mailto:${email}`}
            className="mt-4 block break-all text-center text-sm text-muted hover:text-terra"
          >
            ✉ {email}
          </a>
        </div>
      </aside>
    </>
  );
}
