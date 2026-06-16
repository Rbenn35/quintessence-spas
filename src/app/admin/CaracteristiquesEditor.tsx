"use client";

import { clsx } from "@/lib/clsx";

export type CaracRow = { k: string; v: string };
export type CaracFamily = { groupe: string; active: boolean; items: CaracRow[] };

const PRESETS = [
  "Général",
  "Massage et hydrothérapie",
  "Électronique et chauffage",
  "Éclairage et ambiance",
  "Isolation",
  "Filtration et traitement de l'eau",
  "Équipements complémentaires",
];

const input =
  "rounded-xl border border-line bg-card px-3.5 py-2.5 text-sm outline-none focus-visible:border-terra";

export function CaracteristiquesEditor({
  families,
  setFamilies,
}: {
  families: CaracFamily[];
  setFamilies: (f: CaracFamily[]) => void;
}) {
  const patch = (i: number, partial: Partial<CaracFamily>) =>
    setFamilies(families.map((f, idx) => (idx === i ? { ...f, ...partial } : f)));

  const addFamily = () =>
    setFamilies([
      ...families,
      { groupe: "", active: true, items: [{ k: "", v: "" }] },
    ]);
  const removeFamily = (i: number) =>
    setFamilies(families.filter((_, idx) => idx !== i));
  const addRow = (i: number) =>
    patch(i, { items: [...families[i].items, { k: "", v: "" }] });
  const removeRow = (i: number, j: number) =>
    patch(i, { items: families[i].items.filter((_, k) => k !== j) });
  const setRow = (i: number, j: number, field: keyof CaracRow, val: string) =>
    patch(i, {
      items: families[i].items.map((r, k) =>
        k === j ? { ...r, [field]: val } : r,
      ),
    });

  return (
    <div className="space-y-4">
      {families.map((f, i) => (
        <div
          key={i}
          className={clsx(
            "rounded-2xl border p-4",
            f.active
              ? "border-line bg-card"
              : "border-dashed border-line bg-cream/50",
          )}
        >
          <div className="flex items-center gap-3">
            <label className="flex shrink-0 items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={f.active}
                onChange={() => patch(i, { active: !f.active })}
                className="h-4 w-4 accent-[color:var(--color-terra)]"
              />
              <span className="hidden sm:inline">Activée</span>
            </label>
            <input
              list="famille-presets"
              placeholder="Nom de la famille (ex. Massage et hydrothérapie)"
              value={f.groupe}
              onChange={(e) => patch(i, { groupe: e.target.value })}
              className={clsx(input, "flex-1 font-medium")}
            />
            <button
              type="button"
              onClick={() => removeFamily(i)}
              title="Supprimer la famille"
              className="shrink-0 rounded-lg px-2 py-1 text-muted hover:bg-cream hover:text-terra-dark"
            >
              Supprimer
            </button>
          </div>

          {f.active ? (
            <div className="mt-3 space-y-2">
              {f.items.map((r, j) => (
                <div key={j} className="flex items-center gap-2">
                  <input
                    placeholder="Caractéristique"
                    value={r.k}
                    onChange={(e) => setRow(i, j, "k", e.target.value)}
                    className={clsx(input, "flex-1")}
                  />
                  <input
                    placeholder="Valeur"
                    value={r.v}
                    onChange={(e) => setRow(i, j, "v", e.target.value)}
                    className={clsx(input, "flex-1")}
                  />
                  <button
                    type="button"
                    onClick={() => removeRow(i, j)}
                    aria-label="Supprimer la ligne"
                    className="shrink-0 rounded-lg px-2 py-2 text-muted hover:bg-cream hover:text-terra-dark"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addRow(i)}
                className="text-sm font-medium text-terra hover:underline"
              >
                + Ajouter une ligne
              </button>
            </div>
          ) : (
            <p className="mt-2 text-xs text-muted">
              Famille désactivée (non affichée sur la fiche).
            </p>
          )}
        </div>
      ))}

      <datalist id="famille-presets">
        {PRESETS.map((p) => (
          <option key={p} value={p} />
        ))}
      </datalist>

      <button
        type="button"
        onClick={addFamily}
        className="rounded-full border border-line px-4 py-2 text-sm hover:bg-cream"
      >
        + Ajouter une famille
      </button>
    </div>
  );
}
