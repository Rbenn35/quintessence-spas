"use client";

import { useMemo, useState } from "react";
import { SpaCard } from "@/components/SpaCard";
import { type Gamme, type Spa } from "@/lib/spas";
import type { Rating } from "@/lib/reviews";
import { clsx } from "@/lib/clsx";

type GammeFilter = Gamme | "Toutes";
type PlacesFilter = "all" | "small" | "medium" | "large";
type SortKey = "popularite" | "prix-asc" | "prix-desc" | "places";

const placesOptions: { value: PlacesFilter; label: string }[] = [
  { value: "all", label: "Toutes tailles" },
  { value: "small", label: "2 à 4 places" },
  { value: "medium", label: "5 à 6 places" },
  { value: "large", label: "7 places et +" },
];

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "popularite", label: "Popularité" },
  { value: "prix-asc", label: "Prix croissant" },
  { value: "prix-desc", label: "Prix décroissant" },
  { value: "places", label: "Nombre de places" },
];

function matchPlaces(places: number, filter: PlacesFilter): boolean {
  if (filter === "small") return places <= 4;
  if (filter === "medium") return places === 5 || places === 6;
  if (filter === "large") return places >= 7;
  return true;
}

export function CatalogueClient({
  spas,
  gammes,
  ratings = {},
  initialGamme = "Toutes",
}: {
  spas: Spa[];
  gammes: string[];
  ratings?: Record<string, Rating>;
  initialGamme?: GammeFilter;
}) {
  const [gamme, setGamme] = useState<GammeFilter>(initialGamme);
  const [places, setPlaces] = useState<PlacesFilter>("all");
  const [sort, setSort] = useState<SortKey>("popularite");

  const filtered = useMemo(() => {
    const list = spas.filter(
      (s) =>
        (gamme === "Toutes" || s.gamme === gamme) &&
        matchPlaces(s.places, places),
    );

    const priceOf = (p: number | null) => (p === null ? Infinity : p);

    switch (sort) {
      case "prix-asc":
        return [...list].sort(
          (a, b) => priceOf(a.prixIndicatif) - priceOf(b.prixIndicatif),
        );
      case "prix-desc":
        return [...list].sort(
          (a, b) => priceOf(b.prixIndicatif) - priceOf(a.prixIndicatif),
        );
      case "places":
        return [...list].sort((a, b) => a.places - b.places);
      default:
        return list;
    }
  }, [spas, gamme, places, sort]);

  return (
    <div>
      {/* Barre de filtres */}
      <div className="flex flex-col gap-5 rounded-2xl border border-line bg-cream p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["Toutes", ...gammes] as GammeFilter[]).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGamme(g)}
              aria-pressed={gamme === g}
              className={clsx(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                gamme === g
                  ? "border-terra bg-terra text-white"
                  : "border-line bg-card text-ink hover:border-terra",
              )}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <label className="sr-only" htmlFor="filtre-places">
            Filtrer par nombre de places
          </label>
          <select
            id="filtre-places"
            value={places}
            onChange={(e) => setPlaces(e.target.value as PlacesFilter)}
            className="rounded-full border border-line bg-card px-4 py-2 text-sm"
          >
            {placesOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="tri">
            Trier les spas
          </label>
          <select
            id="tri"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-full border border-line bg-card px-4 py-2 text-sm"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                Trier : {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Résultats */}
      <p className="mt-6 text-sm text-muted" aria-live="polite">
        {filtered.length} modèle{filtered.length > 1 ? "s" : ""} affiché
        {filtered.length > 1 ? "s" : ""}
      </p>

      {filtered.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((spa) => (
            <SpaCard key={spa.slug} spa={spa} rating={ratings[spa.slug]} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-line bg-cream p-10 text-center text-muted">
          Aucun modèle ne correspond à ces critères. Élargissez votre recherche
          ou demandez-nous conseil.
        </div>
      )}
    </div>
  );
}
