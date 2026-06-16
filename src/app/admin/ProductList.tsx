"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Spa } from "@/lib/spas";
import {
  formatEuro,
  prixApresRemise,
  remiseEffectivePct,
  badgePersonnalise,
} from "@/lib/spas";
import { PlugIcon } from "@/components/PlugIcon";

const fieldInput =
  "w-full rounded-xl border border-line bg-card px-3 py-2 text-sm outline-none focus-visible:border-terra";

export function ProductList({ spas }: { spas: Spa[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Champs d'édition en masse : chacun activable indépendamment.
  const [editPrix, setEditPrix] = useState(false);
  const [prix, setPrix] = useState("");
  const [editPromo, setEditPromo] = useState(false);
  const [promo, setPromo] = useState("");
  const [editBadge, setEditBadge] = useState(false);
  const [badgeLabel, setBadgeLabel] = useState("");
  const [badgeActive, setBadgeActive] = useState(true);

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const allSelected = selected.size === spas.length && spas.length > 0;
  const someSelected = selected.size > 0;

  const slugs = useMemo(() => [...selected], [selected]);

  function toggle(slug: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(spas.map((s) => s.slug)));
  }

  async function apply() {
    const patch: Record<string, unknown> = {};
    if (editPrix) patch.prixIndicatif = prix.trim() === "" ? null : Number(prix);
    if (editPromo) patch.prixPromo = promo.trim() === "" ? null : Number(promo);
    if (editBadge) {
      patch.badgeLabel = badgeLabel;
      patch.badgeActive = badgeActive;
    }
    if (Object.keys(patch).length === 0) {
      setMsg("Cochez au moins un champ à modifier.");
      return;
    }
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/admin/products/bulk", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slugs, patch }),
    });
    setSaving(false);
    if (res.ok) {
      const d = await res.json().catch(() => ({ count: slugs.length }));
      setMsg(`✓ ${d.count} produit(s) mis à jour.`);
      setSelected(new Set());
      setEditPrix(false);
      setEditPromo(false);
      setEditBadge(false);
      setPrix("");
      setPromo("");
      setBadgeLabel("");
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setMsg(d.error || "Erreur lors de la mise à jour.");
    }
  }

  return (
    <>
      {/* Barre de sélection / édition en masse */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            className="h-4 w-4 accent-[color:var(--color-terra)]"
          />
          {someSelected
            ? `${selected.size} sélectionné(s)`
            : "Tout sélectionner"}
        </label>
        {someSelected && (
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            className="text-sm text-muted hover:text-terra-dark hover:underline"
          >
            Tout désélectionner
          </button>
        )}
      </div>

      {someSelected && (
        <div className="mt-3 rounded-2xl border border-terra/40 bg-cream p-5">
          <div className="text-sm font-semibold">
            Modifier en masse {selected.size} produit(s)
          </div>
          <p className="mt-1 text-xs text-muted">
            Cochez chaque champ à modifier. Les champs décochés ne sont pas
            touchés.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {/* Prix public */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={editPrix}
                  onChange={(e) => setEditPrix(e.target.checked)}
                  className="h-4 w-4 accent-[color:var(--color-terra)]"
                />
                Prix public (€)
              </label>
              <input
                type="number"
                disabled={!editPrix}
                value={prix}
                onChange={(e) => setPrix(e.target.value)}
                placeholder="vide = sur devis"
                className={`mt-2 ${fieldInput} disabled:opacity-50`}
              />
            </div>

            {/* Prix promo */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={editPromo}
                  onChange={(e) => setEditPromo(e.target.checked)}
                  className="h-4 w-4 accent-[color:var(--color-terra)]"
                />
                Prix promo (€)
              </label>
              <input
                type="number"
                disabled={!editPromo}
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                placeholder="vide = retirer la promo"
                className={`mt-2 ${fieldInput} disabled:opacity-50`}
              />
            </div>

            {/* Badge personnalisé */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={editBadge}
                  onChange={(e) => setEditBadge(e.target.checked)}
                  className="h-4 w-4 accent-[color:var(--color-terra)]"
                />
                Badge personnalisé
              </label>
              <input
                disabled={!editBadge}
                value={badgeLabel}
                onChange={(e) => setBadgeLabel(e.target.value)}
                placeholder="Texte du badge"
                className={`mt-2 ${fieldInput} disabled:opacity-50`}
              />
              <label className="mt-2 flex items-center gap-2 text-xs text-muted">
                <input
                  type="checkbox"
                  disabled={!editBadge}
                  checked={badgeActive}
                  onChange={(e) => setBadgeActive(e.target.checked)}
                  className="h-4 w-4 accent-[color:var(--color-terra)]"
                />
                Afficher le badge (sinon il est masqué)
              </label>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={apply}
              disabled={saving}
              className="rounded-full bg-terra px-6 py-2.5 text-sm font-semibold text-white hover:bg-terra-dark disabled:opacity-60"
            >
              {saving ? "Application…" : "Appliquer aux sélectionnés"}
            </button>
            {msg && <span className="text-sm text-terra-dark">{msg}</span>}
          </div>
        </div>
      )}

      {/* Liste des produits */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-line">
        {spas.map((s, i) => {
          const pf = prixApresRemise(s);
          const remise = remiseEffectivePct(s);
          const badge = badgePersonnalise(s);
          const checked = selected.has(s.slug);
          return (
            <div
              key={s.slug}
              className={`flex items-center gap-3 px-5 py-4 transition-colors ${
                checked ? "bg-cream" : i % 2 ? "bg-cream/40" : "bg-card"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(s.slug)}
                aria-label={`Sélectionner ${s.name}`}
                className="h-4 w-4 shrink-0 accent-[color:var(--color-terra)]"
              />
              <Link
                href={`/admin/${s.slug}`}
                className="flex min-w-0 flex-1 items-center justify-between gap-4 hover:text-terra-dark"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 font-medium">
                    <span className="truncate">{s.name}</span>
                    {badge && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-terra px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                        <PlugIcon className="h-3 w-3 shrink-0" />
                        {badge}
                      </span>
                    )}
                  </div>
                  <div className="truncate text-xs text-muted">
                    {s.gamme} · {s.places} places · /{s.slug}
                    {s.photos?.length
                      ? ` · ${s.photos.length} photo(s)`
                      : " · sans photo"}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right text-sm">
                    {pf !== null ? (
                      <>
                        {remise !== null ? (
                          <span className="mr-1.5 text-xs text-muted line-through">
                            {formatEuro(s.prixIndicatif as number)}
                          </span>
                        ) : null}
                        <span className="font-semibold">{formatEuro(pf)}</span>
                      </>
                    ) : (
                      <span className="text-muted">Sur devis</span>
                    )}
                  </div>
                  <span className="text-terra">→</span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
