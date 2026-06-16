"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/** Barre d'achat flottante (prix + CTA), visible au scroll. */
export function StickyBuyBar({
  nom,
  prixFinal,
  prixInitial,
  remisePct,
  devisHref,
}: {
  nom: string;
  prixFinal: number;
  prixInitial: number | null;
  remisePct?: number;
  devisHref: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const doc = document.documentElement;
      const nearBottom = y + window.innerHeight >= doc.scrollHeight - 200;
      setShow(y > 520 && !nearBottom);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 shadow-[0_-6px_24px_rgba(19,49,61,0.08)] backdrop-blur transition-transform duration-300 ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <div className="min-w-0">
          <span className="hidden text-sm font-medium text-muted sm:inline">
            {nom}
          </span>
          <div className="flex items-baseline gap-2">
            {remisePct && prixInitial !== null && (
              <span className="text-xs text-muted line-through">
                {prixInitial.toLocaleString("fr-FR")} €
              </span>
            )}
            <span className="font-serif text-2xl text-terra">
              {prixFinal.toLocaleString("fr-FR")} €
            </span>
            {remisePct && (
              <span className="text-xs font-semibold text-olive">
                -{remisePct} %
              </span>
            )}
          </div>
        </div>
        <Link
          href={devisHref}
          className="shrink-0 rounded-full bg-terra px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-terra-dark"
        >
          Demander mon devis
        </Link>
      </div>
    </div>
  );
}
