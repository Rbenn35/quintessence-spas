"use client";

import { useState } from "react";
import { FeatureIcon, ICON_LIST, type IconName } from "@/components/FeatureIcon";

export type PointFortItem = { text: string; icon: IconName };

export function PointsFortsEditor({
  items,
  setItems,
}: {
  items: PointFortItem[];
  setItems: (i: PointFortItem[]) => void;
}) {
  const [openRow, setOpenRow] = useState<number | null>(null);

  const patch = (i: number, p: Partial<PointFortItem>) =>
    setItems(items.map((it, idx) => (idx === i ? { ...it, ...p } : it)));

  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="rounded-xl border border-line bg-card p-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpenRow(openRow === i ? null : i)}
              title="Choisir l'icône"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-terra/10 text-terra hover:bg-terra/20"
            >
              <FeatureIcon name={it.icon} className="h-5 w-5" />
            </button>
            <input
              placeholder="Point fort"
              value={it.text}
              onChange={(e) => patch(i, { text: e.target.value })}
              className="flex-1 rounded-xl border border-line bg-card px-3 py-2 text-sm outline-none focus-visible:border-terra"
            />
            <button
              type="button"
              onClick={() => setItems(items.filter((_, idx) => idx !== i))}
              aria-label="Supprimer"
              className="shrink-0 rounded-lg px-2 py-2 text-muted hover:bg-cream hover:text-terra-dark"
            >
              ✕
            </button>
          </div>

          {openRow === i && (
            <div className="mt-2 grid grid-cols-7 gap-1.5 rounded-xl border border-line bg-cream/50 p-2 sm:grid-cols-9">
              {ICON_LIST.map((ic) => {
                const active = ic.name === it.icon;
                return (
                  <button
                    key={ic.name}
                    type="button"
                    title={ic.label}
                    onClick={() => {
                      patch(i, { icon: ic.name });
                      setOpenRow(null);
                    }}
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
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          setItems([...items, { text: "", icon: "check" }])
        }
        className="text-sm font-medium text-terra hover:underline"
      >
        + Ajouter un point fort
      </button>
    </div>
  );
}
