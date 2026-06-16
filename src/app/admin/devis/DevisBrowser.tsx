"use client";

import { useMemo, useState } from "react";
import type { DevisRequest } from "@/lib/devis-requests";
import { DevisRequestsList } from "./demandes/DevisRequestsList";

/** Liste de tous les devis avec recherche par N°, nom, prénom, e-mail. */
export function DevisBrowser({ requests }: { requests: DevisRequest[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return requests;
    return requests.filter((r) =>
      [r.ref, r.prenom, r.nom, r.email, r.modeleLabel]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(s)),
    );
  }, [q, requests]);

  return (
    <div>
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher par N° de devis, nom, prénom ou e-mail…"
          className="w-full rounded-full border border-line bg-card py-3 pl-11 pr-4 text-sm outline-none focus-visible:border-terra"
        />
      </div>

      <p className="mt-3 text-sm text-muted">
        {filtered.length} devis
        {q.trim() ? ` trouvé${filtered.length > 1 ? "s" : ""}` : ""}
      </p>

      <div className="mt-4">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-line bg-cream p-10 text-center text-muted">
            {requests.length === 0
              ? "Aucune demande pour le moment. Les devis générés via le formulaire apparaîtront ici."
              : "Aucun devis ne correspond à votre recherche."}
          </div>
        ) : (
          <DevisRequestsList requests={filtered} />
        )}
      </div>
    </div>
  );
}
