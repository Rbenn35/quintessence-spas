"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "@/lib/clsx";

/** Navigation de la section Devis : Demandes (liste) / Réglages + aperçus. */
export function DevisTabs() {
  const path = usePathname() ?? "";
  const tab = (href: string, label: string) => (
    <Link
      href={href}
      className={clsx(
        "rounded-full px-4 py-2 text-sm font-medium transition-colors",
        path === href
          ? "bg-terra text-white"
          : "border border-line hover:bg-cream",
      )}
    >
      {label}
    </Link>
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tab("/admin/devis", "Demandes")}
      {tab("/admin/devis/reglages", "Réglages")}
      <span className="mx-1 hidden h-5 w-px bg-line sm:inline-block" />
      <a
        href="/admin/devis/apercu"
        target="_blank"
        rel="noreferrer"
        className="rounded-full border border-line px-4 py-2 text-sm text-muted hover:bg-cream hover:text-ink"
      >
        Aperçu du devis ↗
      </a>
      <a
        href="/admin/devis/apercu-info"
        target="_blank"
        rel="noreferrer"
        className="rounded-full border border-line px-4 py-2 text-sm text-muted hover:bg-cream hover:text-ink"
      >
        Aperçu e-mail générique ↗
      </a>
    </div>
  );
}
