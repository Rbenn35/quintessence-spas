"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Review } from "@/lib/reviews";

type Product = { slug: string; name: string };

export function ReviewsManager({
  reviews,
  products,
}: {
  reviews: Review[];
  products: Product[];
}) {
  const router = useRouter();
  const nameBySlug = useMemo(
    () => new Map(products.map((p) => [p.slug, p.name])),
    [products],
  );

  const [query, setQuery] = useState("");
  const [productFilter, setProductFilter] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reviews.filter((r) => {
      // Filtre produit
      if (productFilter === "global" && r.productSlug) return false;
      if (
        productFilter !== "all" &&
        productFilter !== "global" &&
        r.productSlug !== productFilter
      )
        return false;
      // Recherche texte
      if (!q) return true;
      const hay = [
        r.author,
        r.city ?? "",
        r.text,
        r.productSlug ?? "",
        r.productSlug ? (nameBySlug.get(r.productSlug) ?? "") : "avis global",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [reviews, query, productFilter, nameBySlug]);

  const filteredIds = useMemo(() => filtered.map((r) => r.id), [filtered]);
  const allSelected =
    filteredIds.length > 0 && filteredIds.every((id) => selected.has(id));
  const someSelected = filteredIds.some((id) => selected.has(id));

  function toggle(id: string) {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((s) => {
      const next = new Set(s);
      if (allSelected) filteredIds.forEach((id) => next.delete(id));
      else filteredIds.forEach((id) => next.add(id));
      return next;
    });
  }

  const selectedCount = selected.size;

  async function bulk(action: "delete" | "publish" | "hide") {
    const ids = [...selected];
    if (!ids.length) return;
    if (
      action === "delete" &&
      !confirm(
        `Supprimer définitivement ${ids.length} avis sélectionné${
          ids.length > 1 ? "s" : ""
        } ? Cette action est irréversible.`,
      )
    )
      return;
    setBusy(true);
    const res = await fetch("/api/admin/reviews/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ids }),
    });
    setBusy(false);
    if (res.ok) {
      setSelected(new Set());
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      alert(d.error || "Erreur lors de l'action groupée.");
    }
  }

  const inputCls =
    "rounded-xl border border-line bg-card px-3.5 py-2.5 text-sm outline-none focus-visible:border-terra";

  return (
    <div>
      {/* Recherche + filtre produit */}
      <div className="flex flex-wrap gap-2.5">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher (auteur, ville, texte, modèle)…"
          className={`min-w-[240px] flex-1 ${inputCls}`}
        />
        <select
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
          className={inputCls}
        >
          <option value="all">Tous les avis</option>
          <option value="global">Avis globaux</option>
          {products.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Barre de sélection / actions groupées */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-cream/50 px-4 py-3">
        <label className="flex items-center gap-2.5 text-sm">
          <input
            type="checkbox"
            checked={allSelected}
            ref={(el) => {
              if (el) el.indeterminate = !allSelected && someSelected;
            }}
            onChange={toggleAll}
            className="h-4 w-4 accent-[color:var(--color-terra)]"
          />
          {selectedCount > 0
            ? `${selectedCount} sélectionné${selectedCount > 1 ? "s" : ""}`
            : `Tout sélectionner (${filtered.length})`}
        </label>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy || selectedCount === 0}
            onClick={() => bulk("publish")}
            className="rounded-lg border border-line px-3 py-1.5 text-sm hover:bg-card disabled:opacity-50"
          >
            Publier
          </button>
          <button
            type="button"
            disabled={busy || selectedCount === 0}
            onClick={() => bulk("hide")}
            className="rounded-lg border border-line px-3 py-1.5 text-sm hover:bg-card disabled:opacity-50"
          >
            Masquer
          </button>
          <button
            type="button"
            disabled={busy || selectedCount === 0}
            onClick={() => bulk("delete")}
            className="rounded-lg bg-terra px-3 py-1.5 text-sm font-medium text-white hover:bg-terra-dark disabled:opacity-50"
          >
            Supprimer
          </button>
        </div>
      </div>

      {/* Liste */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-line">
        {filtered.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted">
            Aucun avis ne correspond à la recherche.
          </p>
        ) : (
          filtered.map((r, i) => {
            const checked = selected.has(r.id);
            return (
              <div
                key={r.id}
                className={`flex items-center gap-3 px-4 py-4 ${
                  checked ? "bg-terra/5" : i % 2 ? "bg-cream/40" : "bg-card"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(r.id)}
                  className="h-4 w-4 shrink-0 accent-[color:var(--color-terra)]"
                  aria-label={`Sélectionner l'avis de ${r.author}`}
                />
                <Link
                  href={`/admin/avis/${r.id}`}
                  className="flex min-w-0 flex-1 items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[#e0a93b]">
                        {"★".repeat(r.rating)}
                        <span className="text-line">
                          {"★".repeat(5 - r.rating)}
                        </span>
                      </span>
                      <span className="font-medium">{r.author}</span>
                      {r.city && (
                        <span className="text-xs text-muted">· {r.city}</span>
                      )}
                    </div>
                    <div className="mt-0.5 truncate text-xs text-muted">
                      {r.productSlug
                        ? `Modèle : ${nameBySlug.get(r.productSlug) ?? r.productSlug}`
                        : "Avis global"}{" "}
                      · {r.text}
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                      r.published
                        ? "bg-terra/10 text-terra"
                        : "bg-line/60 text-muted"
                    }`}
                  >
                    {r.published ? "Publié" : "Masqué"}
                  </span>
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
