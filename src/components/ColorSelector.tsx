"use client";

import { useState } from "react";
import type { SpaColor } from "@/lib/spas";

function Check({ dark }: { dark: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke={dark ? "#13313d" : "#fff"}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/** Estime si une couleur est claire (pour choisir la couleur de la coche). */
function isLight(hex: string): boolean {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return false;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

function Group({ label, colors }: { label: string; colors: SpaColor[] }) {
  const [selected, setSelected] = useState(0);
  return (
    <div>
      <div className="flex items-baseline gap-2">
        <span className="font-serif text-lg">{label}</span>
        <span className="text-[12.5px] text-muted">
          {colors[selected]?.name}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-3">
        {colors.map((c, i) => {
          const active = i === selected;
          return (
            <button
              key={`${c.name}-${i}`}
              type="button"
              onClick={() => setSelected(i)}
              title={c.name}
              aria-label={c.name}
              aria-pressed={active}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-black/10 transition"
              style={{
                background: c.hex,
                boxShadow: active
                  ? "inset 0 0 0 2px #fff, 0 0 0 4px var(--color-terra)"
                  : undefined,
              }}
            >
              <span className={active ? "opacity-100" : "opacity-0"}>
                <Check dark={isLight(c.hex)} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ColorSelector({
  coque,
  tablier,
}: {
  coque?: SpaColor[];
  tablier?: SpaColor[];
}) {
  const hasCoque = coque && coque.length > 0;
  const hasTablier = tablier && tablier.length > 0;
  if (!hasCoque && !hasTablier) return null;

  return (
    <div className="space-y-5">
      {hasCoque && <Group label="Coque" colors={coque!} />}
      {hasTablier && <Group label="Tablier" colors={tablier!} />}
    </div>
  );
}
