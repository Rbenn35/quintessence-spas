/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type {
  Gamme,
  Spa,
  SpaColor,
  StockStatus,
  DeliveryFormula,
} from "@/lib/spas";
import {
  CaracteristiquesEditor,
  type CaracFamily,
} from "./CaracteristiquesEditor";
import { PointsFortsEditor, type PointFortItem } from "./PointsFortsEditor";
import {
  FeatureIcon,
  ICON_LIST,
  iconForFeature,
  type IconName,
} from "@/components/FeatureIcon";

function cleanColors(colors: SpaColor[]): SpaColor[] {
  return colors
    .filter((c) => c.name.trim())
    .map((c) => ({ name: c.name.trim(), hex: c.hex }));
}

function cleanFormulas(formulas: DeliveryFormula[]): DeliveryFormula[] {
  return formulas
    .filter((f) => f.name.trim())
    .map((f) => ({
      name: f.name.trim(),
      description: f.description.trim(),
      price: f.price,
      ...(f.recommended ? { recommended: true } : {}),
    }));
}

function FormulaList({
  formulas,
  setFormulas,
}: {
  formulas: DeliveryFormula[];
  setFormulas: (f: DeliveryFormula[]) => void;
}) {
  const patch = (i: number, p: Partial<DeliveryFormula>) =>
    setFormulas(formulas.map((f, idx) => (idx === i ? { ...f, ...p } : f)));
  return (
    <div className="space-y-3">
      {formulas.map((f, i) => (
        <div
          key={i}
          className="rounded-xl border border-line bg-card p-3"
        >
          <div className="flex flex-wrap items-center gap-2">
            <input
              placeholder="Nom de la formule"
              value={f.name}
              onChange={(e) => patch(i, { name: e.target.value })}
              className="min-w-[160px] flex-1 rounded-xl border border-line bg-card px-3 py-2 text-sm font-medium outline-none focus-visible:border-terra"
            />
            <div className="flex items-center gap-1">
              <input
                type="number"
                placeholder="Prix"
                value={f.price ?? ""}
                onChange={(e) =>
                  patch(i, {
                    price: e.target.value === "" ? null : Number(e.target.value),
                  })
                }
                className="w-28 rounded-xl border border-line bg-card px-3 py-2 text-right text-sm outline-none focus-visible:border-terra"
              />
              <span className="text-sm text-muted">€</span>
            </div>
            <label className="flex items-center gap-1.5 text-xs">
              <input
                type="checkbox"
                checked={!!f.recommended}
                onChange={(e) => patch(i, { recommended: e.target.checked })}
                className="h-4 w-4 accent-[color:var(--color-terra)]"
              />
              Recommandé
            </label>
            <button
              type="button"
              onClick={() => setFormulas(formulas.filter((_, idx) => idx !== i))}
              aria-label="Supprimer"
              className="rounded-lg px-2 py-2 text-muted hover:bg-cream hover:text-terra-dark"
            >
              ✕
            </button>
          </div>
          <input
            placeholder="Description (ce qui est inclus)"
            value={f.description}
            onChange={(e) => patch(i, { description: e.target.value })}
            className="mt-2 w-full rounded-xl border border-line bg-card px-3 py-2 text-sm outline-none focus-visible:border-terra"
          />
          <p className="mt-1 text-xs text-muted">
            Prix vide = « Sur devis ».
          </p>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          setFormulas([
            ...formulas,
            { name: "", description: "", price: null },
          ])
        }
        className="text-sm font-medium text-terra hover:underline"
      >
        + Ajouter une formule
      </button>
    </div>
  );
}

function ColorList({
  title,
  colors,
  setColors,
}: {
  title: string;
  colors: SpaColor[];
  setColors: (c: SpaColor[]) => void;
}) {
  const patch = (i: number, p: Partial<SpaColor>) =>
    setColors(colors.map((c, idx) => (idx === i ? { ...c, ...p } : c)));
  return (
    <div>
      <div className="text-sm font-medium">{title}</div>
      <div className="mt-2 space-y-2">
        {colors.map((c, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="color"
              value={/^#[0-9a-f]{6}$/i.test(c.hex) ? c.hex : "#cccccc"}
              onChange={(e) => patch(i, { hex: e.target.value })}
              className="h-9 w-12 shrink-0 cursor-pointer rounded border border-line bg-card"
            />
            <input
              placeholder="Nom de la couleur"
              value={c.name}
              onChange={(e) => patch(i, { name: e.target.value })}
              className="flex-1 rounded-xl border border-line bg-card px-3 py-2 text-sm outline-none focus-visible:border-terra"
            />
            <button
              type="button"
              onClick={() => setColors(colors.filter((_, idx) => idx !== i))}
              aria-label="Supprimer"
              className="shrink-0 rounded-lg px-2 py-2 text-muted hover:bg-cream hover:text-terra-dark"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setColors([...colors, { name: "", hex: "#cccccc" }])}
          className="text-sm font-medium text-terra hover:underline"
        >
          + Ajouter une couleur
        </button>
      </div>
    </div>
  );
}

const input =
  "w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-sm outline-none focus-visible:border-terra";
const label = "block text-sm font-medium";

export function ProductEditor({
  initial,
  isNew,
  gammes,
}: {
  initial: Spa;
  isNew: boolean;
  gammes: Gamme[];
}) {
  const router = useRouter();
  const [name, setName] = useState(initial.name);
  const [slug, setSlug] = useState(initial.slug);
  const [gamme, setGamme] = useState<Gamme>(initial.gamme);
  const [places, setPlaces] = useState(String(initial.places));
  const [larg, setLarg] = useState(String(initial.dimensions.largeur));
  const [prof, setProf] = useState(String(initial.dimensions.profondeur));
  const [haut, setHaut] = useState(String(initial.dimensions.hauteur));
  const [prix, setPrix] = useState(
    initial.prixIndicatif === null ? "" : String(initial.prixIndicatif),
  );
  // Prix promo explicite. Migration douce : si le produit n'a qu'une remise %,
  // on pré-remplit le prix promo calculé pour ne rien perdre à l'enregistrement.
  const [prixPromo, setPrixPromo] = useState(() => {
    if (typeof initial.prixPromo === "number") return String(initial.prixPromo);
    if (initial.prixIndicatif !== null && initial.remisePct)
      return String(
        Math.round(initial.prixIndicatif * (1 - initial.remisePct / 100)),
      );
    return "";
  });
  const [badgeLabel, setBadgeLabel] = useState(initial.badgeLabel ?? "");
  const [badgeActive, setBadgeActive] = useState(!!initial.badgeActive);
  const [badgeIcon, setBadgeIcon] = useState<IconName>(
    (initial.badgeIcon as IconName) || "plug",
  );
  const [formulas, setFormulas] = useState<DeliveryFormula[]>(
    initial.deliveryFormulas ?? [],
  );
  const [jets, setJets] = useState(String(initial.jets));
  const [conso, setConso] = useState(initial.consommation);
  const [accroche, setAccroche] = useState(initial.accroche);
  const [description, setDescription] = useState(initial.description);
  const [pf, setPf] = useState<PointFortItem[]>(
    initial.pointsForts.map((t, i) => ({
      text: t,
      icon: (initial.pointsFortsIcons?.[i] as IconName) ?? iconForFeature(t),
    })),
  );
  const [inclusText, setInclusText] = useState(
    (initial.inclus ?? []).join("\n"),
  );
  const [families, setFamilies] = useState<CaracFamily[]>(
    (initial.caracteristiques ?? []).map((f) => ({
      groupe: f.groupe,
      active: true,
      items: f.items.map(([k, v]) => ({ k, v })),
    })),
  );
  const [photos, setPhotos] = useState<string[]>(initial.photos ?? []);
  const [coque, setCoque] = useState<SpaColor[]>(initial.colorsCoque ?? []);
  const [tablier, setTablier] = useState<SpaColor[]>(
    initial.colorsTablier ?? [],
  );
  const [stockStatus, setStockStatus] = useState<StockStatus>(
    initial.stockStatus ?? "in_stock",
  );
  const [stockAvailableAt, setStockAvailableAt] = useState(
    initial.stockAvailableAt ?? "",
  );
  const [status, setStatus] = useState<"" | "saving">("");
  const [msg, setMsg] = useState("");

  function slugify(v: string) {
    return v
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function build(): Spa | null {
    const caracteristiques = families
      .filter((f) => f.active)
      .map((f) => ({
        groupe: f.groupe.trim(),
        items: f.items
          .filter((r) => r.k.trim() || r.v.trim())
          .map((r) => [r.k.trim(), r.v.trim()] as [string, string]),
      }))
      .filter((f) => f.groupe && f.items.length > 0);
    const lines = (t: string) =>
      t
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
    const pfClean = pf.filter((p) => p.text.trim());
    return {
      slug: slug.trim(),
      name: name.trim(),
      gamme,
      places: Number(places) || 0,
      dimensions: {
        largeur: Number(larg) || 0,
        profondeur: Number(prof) || 0,
        hauteur: Number(haut) || 0,
      },
      prixIndicatif: prix.trim() === "" ? null : Number(prix),
      ...(prixPromo.trim() ? { prixPromo: Number(prixPromo) } : {}),
      ...(badgeLabel.trim()
        ? { badgeLabel: badgeLabel.trim(), badgeIcon }
        : {}),
      ...(badgeActive ? { badgeActive: true } : {}),
      jets: Number(jets) || 0,
      consommation: conso,
      accroche,
      description,
      pointsForts: pfClean.map((p) => p.text.trim()),
      ...(pfClean.length
        ? { pointsFortsIcons: pfClean.map((p) => p.icon) }
        : {}),
      ...(lines(inclusText).length ? { inclus: lines(inclusText) } : {}),
      placeholder: initial.placeholder ?? ["#cfe2ea", "#1c6e8e"],
      ...(photos.length ? { photos } : {}),
      ...(caracteristiques.length ? { caracteristiques } : {}),
      ...(cleanColors(coque).length ? { colorsCoque: cleanColors(coque) } : {}),
      ...(cleanColors(tablier).length
        ? { colorsTablier: cleanColors(tablier) }
        : {}),
      stockStatus,
      ...(stockStatus === "production" && stockAvailableAt.trim()
        ? { stockAvailableAt: stockAvailableAt.trim() }
        : {}),
      ...(cleanFormulas(formulas).length
        ? { deliveryFormulas: cleanFormulas(formulas) }
        : {}),
    };
  }

  async function save() {
    const spa = build();
    if (!spa) return;
    if (!spa.slug || !spa.name) {
      setMsg("Le nom et le slug sont obligatoires.");
      return;
    }
    setStatus("saving");
    setMsg("");
    const res = await fetch(
      isNew ? "/api/admin/products" : `/api/admin/products/${initial.slug}`,
      {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spa),
      },
    );
    setStatus("");
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setMsg(d.error || "Erreur à l'enregistrement.");
    }
  }

  async function remove() {
    if (!confirm(`Supprimer définitivement « ${initial.name} » ?`)) return;
    await fetch(`/api/admin/products/${initial.slug}`, { method: "DELETE" });
    router.push("/admin");
    router.refresh();
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (res.ok) {
        const d = await res.json();
        setPhotos((p) => [...p, d.path]);
      }
    }
    e.target.value = "";
  }

  function movePhoto(i: number, dir: number) {
    setPhotos((p) => {
      const a = [...p];
      const j = i + dir;
      if (j < 0 || j >= a.length) return a;
      [a[i], a[j]] = [a[j], a[i]];
      return a;
    });
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/admin" className="text-sm text-terra hover:underline">
        ← Retour au catalogue
      </Link>
      <h1 className="mt-3 text-3xl">
        {isNew ? "Nouveau produit" : `Modifier · ${initial.name}`}
      </h1>

      <div className="mt-8 space-y-6">
        {/* Identité */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Nom</label>
            <input
              className={`mt-1.5 ${input}`}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (isNew) setSlug(slugify(e.target.value));
              }}
            />
          </div>
          <div>
            <label className={label}>Slug (URL)</label>
            <input
              className={`mt-1.5 ${input}`}
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
            />
          </div>
          <div>
            <label className={label}>Gamme</label>
            <select
              className={`mt-1.5 ${input}`}
              value={gamme}
              onChange={(e) => setGamme(e.target.value as Gamme)}
            >
              {gammes.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Nombre de places</label>
            <input
              type="number"
              className={`mt-1.5 ${input}`}
              value={places}
              onChange={(e) => setPlaces(e.target.value)}
            />
          </div>
        </div>

        {/* Dimensions + jets */}
        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <label className={label}>Largeur (cm)</label>
            <input type="number" className={`mt-1.5 ${input}`} value={larg} onChange={(e) => setLarg(e.target.value)} />
          </div>
          <div>
            <label className={label}>Profondeur (cm)</label>
            <input type="number" className={`mt-1.5 ${input}`} value={prof} onChange={(e) => setProf(e.target.value)} />
          </div>
          <div>
            <label className={label}>Hauteur (cm)</label>
            <input type="number" className={`mt-1.5 ${input}`} value={haut} onChange={(e) => setHaut(e.target.value)} />
          </div>
          <div>
            <label className={label}>Jets</label>
            <input type="number" className={`mt-1.5 ${input}`} value={jets} onChange={(e) => setJets(e.target.value)} />
          </div>
        </div>

        {/* Prix */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Prix public (€, vide = sur devis)</label>
            <input type="number" className={`mt-1.5 ${input}`} value={prix} onChange={(e) => setPrix(e.target.value)} />
          </div>
          <div>
            <label className={label}>Prix promo (€, vide = pas de promo)</label>
            <input type="number" className={`mt-1.5 ${input}`} value={prixPromo} onChange={(e) => setPrixPromo(e.target.value)} />
            <p className="mt-1 text-xs text-muted">
              S&apos;il est rempli, le prix public est barré et la réduction
              affichée automatiquement.
            </p>
          </div>
        </div>

        {/* Badge personnalisé */}
        <div className="rounded-2xl border border-line bg-card p-4">
          <label className="flex items-center gap-2.5 text-sm font-medium">
            <input
              type="checkbox"
              checked={badgeActive}
              onChange={(e) => setBadgeActive(e.target.checked)}
              className="h-4 w-4 accent-[color:var(--color-terra)]"
            />
            Afficher un badge personnalisé sur ce produit
          </label>
          <div className="mt-3 flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full bg-terra px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white"
              title="Aperçu du badge"
            >
              <FeatureIcon name={badgeIcon} className="h-3.5 w-3.5 shrink-0" />
              {badgeLabel.trim() || "Badge"}
            </span>
          </div>
          <input
            className={`mt-3 ${input}`}
            value={badgeLabel}
            placeholder="Texte du badge (ex. Nouveauté, Coup de cœur, Déstockage)"
            onChange={(e) => setBadgeLabel(e.target.value)}
          />

          {/* Choix de l'icône du badge */}
          <p className="mt-3 text-xs font-medium text-ink">Icône du badge</p>
          <div className="mt-1.5 grid grid-cols-8 gap-1.5 rounded-xl border border-line bg-cream/50 p-2 sm:grid-cols-11">
            {ICON_LIST.map((ic) => {
              const active = ic.name === badgeIcon;
              return (
                <button
                  key={ic.name}
                  type="button"
                  title={ic.label}
                  onClick={() => setBadgeIcon(ic.name)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${
                    active
                      ? "border-terra bg-terra/10 text-terra"
                      : "border-transparent text-ink hover:bg-card"
                  }`}
                >
                  <FeatureIcon name={ic.name} className="h-5 w-5" />
                </button>
              );
            })}
          </div>

          <p className="mt-2 text-xs text-muted">
            Le badge n&apos;apparaît que s&apos;il est activé et qu&apos;un texte
            est renseigné. Il s&apos;affiche sur la vignette du catalogue et la
            fiche produit. L&apos;icône par défaut est la prise de courant.
          </p>
        </div>

        <div>
          <label className={label}>Énergie / consommation</label>
          <input className={`mt-1.5 ${input}`} value={conso} onChange={(e) => setConso(e.target.value)} />
        </div>
        <div>
          <label className={label}>Accroche</label>
          <input className={`mt-1.5 ${input}`} value={accroche} onChange={(e) => setAccroche(e.target.value)} />
        </div>
        <div>
          <label className={label}>Description</label>
          <textarea rows={5} className={`mt-1.5 ${input}`} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        {/* Photos */}
        <div>
          <label className={label}>Photos (la 1re est la principale)</label>
          <div className="mt-2 flex flex-wrap gap-3">
            {photos.map((src, i) => (
              <div key={src} className="relative h-24 w-24 overflow-hidden rounded-xl border border-line">
                <img src={src} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 flex justify-between bg-ink/60 px-1 py-0.5 text-xs text-white">
                  <button type="button" onClick={() => movePhoto(i, -1)} aria-label="Avancer">‹</button>
                  <button type="button" onClick={() => setPhotos((p) => p.filter((_, j) => j !== i))} aria-label="Supprimer">✕</button>
                  <button type="button" onClick={() => movePhoto(i, 1)} aria-label="Reculer">›</button>
                </div>
              </div>
            ))}
            <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-xl border border-dashed border-line text-3xl text-muted hover:border-terra">
              +
              <input type="file" accept="image/*" multiple className="hidden" onChange={onUpload} />
            </label>
          </div>
        </div>

        <div>
          <label className={label}>Points forts</label>
          <p className="mt-1 text-xs text-muted">
            Cliquez l&apos;icône à gauche de chaque ligne pour la choisir parmi
            la palette.
          </p>
          <div className="mt-2">
            <PointsFortsEditor items={pf} setItems={setPf} />
          </div>
        </div>

        <div>
          <label className={label}>Ce qui est inclus (un par ligne)</label>
          <textarea rows={6} className={`mt-1.5 ${input}`} value={inclusText} onChange={(e) => setInclusText(e.target.value)} />
        </div>

        {/* Couleurs disponibles */}
        <div>
          <label className={label}>Couleurs disponibles</label>
          <p className="mt-1 text-xs text-muted">
            Pastilles affichées sur la fiche (coque + tablier). Choisissez la
            couleur et nommez-la.
          </p>
          <div className="mt-3 grid gap-6 sm:grid-cols-2">
            <ColorList title="Coque" colors={coque} setColors={setCoque} />
            <ColorList
              title="Tablier"
              colors={tablier}
              setColors={setTablier}
            />
          </div>
        </div>

        {/* Disponibilité / stock */}
        <div>
          <label className={label}>Disponibilité</label>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <select
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value as StockStatus)}
              className={`${input} max-w-xs`}
            >
              <option value="in_stock">En stock</option>
              <option value="production">En cours de production</option>
              <option value="out_of_stock">En rupture de stock</option>
            </select>
            {stockStatus === "production" && (
              <input
                placeholder="Disponible le (ex. septembre 2026)"
                value={stockAvailableAt}
                onChange={(e) => setStockAvailableAt(e.target.value)}
                className={`${input} min-w-[220px] flex-1`}
              />
            )}
          </div>
        </div>

        {/* Formules de livraison & installation */}
        <div>
          <label className={label}>
            Formules de livraison &amp; installation
          </label>
          <p className="mt-1 text-xs text-muted">
            Affichées en bannière sur la fiche. Nom, descriptif, prix, et la
            formule « Recommandé ».
          </p>
          <div className="mt-3">
            <FormulaList formulas={formulas} setFormulas={setFormulas} />
          </div>
        </div>

        <div>
          <label className={label}>Caractéristiques techniques</label>
          <p className="mt-1 text-xs text-muted">
            Activez les familles utiles, puis ajoutez les lignes (caractéristique
            puis valeur). L&apos;affichage sur la fiche est identique au Prado.
          </p>
          <div className="mt-3">
            <CaracteristiquesEditor
              families={families}
              setFamilies={setFamilies}
            />
          </div>
        </div>

        {msg && <p className="text-sm text-terra-dark">{msg}</p>}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={save}
              disabled={status === "saving"}
              className="rounded-full bg-terra px-7 py-3 font-semibold text-white hover:bg-terra-dark disabled:opacity-60"
            >
              {status === "saving" ? "Enregistrement…" : "Enregistrer"}
            </button>
            <Link href="/admin" className="rounded-full border border-line px-6 py-3 text-sm hover:bg-cream">
              Annuler
            </Link>
          </div>
          {!isNew && (
            <button type="button" onClick={remove} className="text-sm text-terra-dark hover:underline">
              Supprimer ce produit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
