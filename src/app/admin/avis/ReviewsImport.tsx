"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function ReviewsImport({
  products,
}: {
  products: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{
    ok: boolean;
    text: string;
    warnings?: string[];
  } | null>(null);

  function downloadTemplate() {
    const slug = products[0]?.slug ?? "prado-6";
    const lines = [
      "auteur,ville,note,avis,produit,publie",
      'Marie Durand,Bordeaux,5,"Spa magnifique, installation parfaite. Je recommande.",,oui',
      `Karim B.,Lyon,5,"Massage puissant, eau toujours impeccable.",${slug},oui`,
      'Sophie L.,Nantes,4,"Très satisfaite, livraison rapide.",,oui',
    ];
    // BOM pour qu'Excel ouvre l'UTF-8 correctement.
    const blob = new Blob(["﻿" + lines.join("\r\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "modele-avis-quintessence.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function doImport() {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setResult({ ok: false, text: "Choisissez d'abord un fichier CSV." });
      return;
    }
    setBusy(true);
    setResult(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/reviews/import", {
      method: "POST",
      body: fd,
    });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.ok && d.ok) {
      setResult({
        ok: true,
        text: `${d.imported} avis importé${d.imported > 1 ? "s" : ""}${
          d.skipped ? ` · ${d.skipped} ligne(s) ignorée(s)` : ""
        }.`,
        warnings: d.warnings,
      });
      if (fileRef.current) fileRef.current.value = "";
      router.refresh();
    } else {
      setResult({ ok: false, text: d.error || "Erreur lors de l'import." });
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-cream/50 p-5">
      <h2 className="text-lg font-semibold">Importer des avis (CSV)</h2>
      <p className="mt-1 text-sm text-muted">
        Téléchargez le modèle, complétez-le, puis importez-le. Laissez la colonne{" "}
        <strong>produit</strong> vide pour un avis général, ou indiquez le{" "}
        <strong>slug</strong> du modèle pour un avis produit.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={downloadTemplate}
          className="rounded-full border border-line bg-card px-4 py-2 text-sm font-medium hover:bg-cream"
        >
          ↓ Télécharger le modèle CSV
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          className="text-sm"
        />
        <button
          type="button"
          onClick={doImport}
          disabled={busy}
          className="rounded-full bg-terra px-5 py-2 text-sm font-semibold text-white hover:bg-terra-dark disabled:opacity-60"
        >
          {busy ? "Import…" : "Importer"}
        </button>
      </div>

      {result && (
        <div
          className={`mt-3 rounded-xl px-4 py-3 text-sm ${
            result.ok
              ? "bg-[#00b67a]/10 text-[#00917f]"
              : "bg-terra/10 text-terra-dark"
          }`}
        >
          {result.text}
          {result.warnings && result.warnings.length > 0 && (
            <ul className="mt-2 list-disc pl-5 text-xs text-muted">
              {result.warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <details className="mt-4 text-sm">
        <summary className="cursor-pointer text-muted">
          Slugs des produits (pour la colonne « produit »)
        </summary>
        <div className="mt-2 flex flex-wrap gap-2">
          {products.map((p) => (
            <span
              key={p.slug}
              className="rounded-lg border border-line bg-card px-2.5 py-1 text-xs"
            >
              {p.name} · <code className="text-terra">{p.slug}</code>
            </span>
          ))}
        </div>
      </details>
    </div>
  );
}
