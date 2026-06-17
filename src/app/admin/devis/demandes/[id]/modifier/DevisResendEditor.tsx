"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DEVIS_TYPE_LABELS,
  type DevisLine,
  type DevisLineType,
} from "@/lib/devis";

const euro = (n: number) => `${n.toLocaleString("fr-FR")} €`;
const TYPES: DevisLineType[] = ["livraison", "installation", "accessoire"];

type Row = {
  id: string;
  type: DevisLineType;
  label: string;
  price: number;
  offered: boolean;
  included: boolean;
};

export function DevisResendEditor({
  requestId,
  clientName,
  clientEmail,
  productName,
  basePrice,
  catalog,
  currentLines,
}: {
  requestId: string;
  clientName: string;
  clientEmail: string;
  productName: string;
  basePrice: number;
  catalog: DevisLine[];
  currentLines: DevisLine[];
}) {
  const router = useRouter();

  // Lignes initiales : catalogue (avec état inclus/offert repris du devis) +
  // éventuelles lignes personnalisées déjà présentes dans le devis.
  const initialRows = useMemo<Row[]>(() => {
    const byId = new Map(currentLines.map((l) => [l.id, l]));
    const catalogRows: Row[] = catalog.map((l) => {
      const cur = byId.get(l.id);
      return {
        id: l.id,
        type: l.type,
        label: l.label,
        price: cur?.price ?? l.price,
        offered: cur?.offered ?? l.offered ?? false,
        included: Boolean(cur),
      };
    });
    const customRows: Row[] = currentLines
      .filter((l) => !catalog.some((c) => c.id === l.id))
      .map((l) => ({
        id: l.id,
        type: l.type,
        label: l.label,
        price: l.price,
        offered: l.offered ?? false,
        included: true,
      }));
    return [...catalogRows, ...customRows];
  }, [catalog, currentLines]);

  const [rows, setRows] = useState<Row[]>(initialRows);
  const [customSeq, setCustomSeq] = useState(0);
  const [busy, setBusy] = useState<"" | "preview" | "send">("");
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);

  const total = useMemo(
    () =>
      basePrice +
      rows
        .filter((r) => r.included && !r.offered)
        .reduce((s, r) => s + (Number(r.price) || 0), 0),
    [rows, basePrice],
  );

  function patchRow(id: string, patch: Partial<Row>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function addCustom(type: DevisLineType) {
    const id = `custom-${customSeq + 1}`;
    setCustomSeq((n) => n + 1);
    setRows((rs) => [
      ...rs,
      { id, type, label: "", price: 0, offered: false, included: true },
    ]);
  }

  function removeRow(id: string) {
    setRows((rs) => rs.filter((r) => r.id !== id));
  }

  function chosenLines(): DevisLine[] {
    return rows
      .filter((r) => r.included && r.label.trim())
      .map((r) => ({
        id: r.id,
        type: r.type,
        label: r.label.trim(),
        price: Number(r.price) || 0,
        active: true,
        ...(r.offered ? { offered: true } : {}),
      }));
  }

  async function preview() {
    setBusy("preview");
    try {
      const res = await fetch(
        `/api/admin/devis/requests/${requestId}/resend`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lines: chosenLines(), preview: true }),
        },
      );
      const data = await res.json();
      if (data.ok) setPreviewHtml(data.html);
      else alert(data.error || "Erreur lors de l'aperçu.");
    } finally {
      setBusy("");
    }
  }

  async function sendNow() {
    if (
      !confirm(
        `Renvoyer le devis à ${clientName} (${clientEmail}) pour un total de ${euro(
          total,
        )} ?`,
      )
    )
      return;
    setBusy("send");
    try {
      const res = await fetch(
        `/api/admin/devis/requests/${requestId}/resend`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lines: chosenLines() }),
        },
      );
      const data = await res.json();
      if (data.ok) {
        alert(data.note || "Devis renvoyé.");
        router.push("/admin/devis");
        router.refresh();
      } else {
        alert(data.error || "Erreur lors de l'envoi.");
      }
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="mt-8">
      {/* Ligne du spa (non modifiable ici) */}
      <div className="rounded-2xl border border-line bg-card p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-medium">{productName}</div>
            <div className="text-xs text-muted">
              Prix du spa (remise comprise)
            </div>
          </div>
          <div className="font-semibold">{euro(basePrice)}</div>
        </div>
      </div>

      {/* Lignes par catégorie */}
      {TYPES.map((type) => {
        const list = rows.filter((r) => r.type === type);
        return (
          <div key={type} className="mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
                {DEVIS_TYPE_LABELS[type]}
              </h2>
              <button
                type="button"
                onClick={() => addCustom(type)}
                className="text-xs font-medium text-terra hover:underline"
              >
                + Ajouter une ligne
              </button>
            </div>

            <div className="mt-2 space-y-2">
              {list.length === 0 && (
                <p className="text-sm text-muted">Aucune ligne.</p>
              )}
              {list.map((r) => {
                const custom = r.id.startsWith("custom-");
                return (
                  <div
                    key={r.id}
                    className={`flex flex-wrap items-center gap-3 rounded-xl border p-3 ${
                      r.included ? "border-terra/40 bg-terra/5" : "border-line"
                    }`}
                  >
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={r.included}
                        onChange={(e) =>
                          patchRow(r.id, { included: e.target.checked })
                        }
                      />
                      <span className="text-sm">Inclure</span>
                    </label>

                    {custom ? (
                      <input
                        type="text"
                        value={r.label}
                        placeholder="Libellé (ex. Pack installation)"
                        onChange={(e) =>
                          patchRow(r.id, { label: e.target.value })
                        }
                        className="min-w-[180px] flex-1 rounded-lg border border-line px-3 py-1.5 text-sm"
                      />
                    ) : (
                      <span className="min-w-[180px] flex-1 text-sm">
                        {r.label}
                      </span>
                    )}

                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={r.price}
                        min={0}
                        onChange={(e) =>
                          patchRow(r.id, { price: Number(e.target.value) })
                        }
                        className="w-24 rounded-lg border border-line px-2 py-1.5 text-right text-sm"
                      />
                      <span className="text-sm text-muted">€</span>
                    </div>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={r.offered}
                        onChange={(e) =>
                          patchRow(r.id, { offered: e.target.checked })
                        }
                      />
                      <span className="text-sm">Offert</span>
                    </label>

                    {custom && (
                      <button
                        type="button"
                        onClick={() => removeRow(r.id)}
                        className="text-xs text-muted hover:text-terra-dark"
                      >
                        Retirer
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Total + actions */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-cream/50 p-5">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted">
            Total TTC
          </div>
          <div className="text-2xl font-semibold">{euro(total)}</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={preview}
            disabled={busy !== ""}
            className="rounded-lg border border-line px-4 py-2 text-sm hover:bg-cream disabled:opacity-60"
          >
            {busy === "preview" ? "Aperçu…" : "Prévisualiser"}
          </button>
          <button
            type="button"
            onClick={sendNow}
            disabled={busy !== ""}
            className="rounded-lg bg-terra px-4 py-2 text-sm font-medium text-white hover:bg-terra-dark disabled:opacity-60"
          >
            {busy === "send" ? "Envoi…" : "Enregistrer et renvoyer"}
          </button>
        </div>
      </div>

      {/* Aperçu en surimpression */}
      {previewHtml !== null && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/60 p-4 sm:p-8">
          <div className="mx-auto flex h-full w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <span className="text-sm font-medium">Aperçu du devis</span>
              <button
                type="button"
                onClick={() => setPreviewHtml(null)}
                className="rounded-lg border border-line px-3 py-1.5 text-sm hover:bg-cream"
              >
                Fermer
              </button>
            </div>
            <iframe
              title="Aperçu du devis"
              srcDoc={previewHtml}
              className="h-full w-full flex-1"
            />
          </div>
        </div>
      )}
    </div>
  );
}
