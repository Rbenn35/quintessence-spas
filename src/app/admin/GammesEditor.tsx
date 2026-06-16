"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const input =
  "flex-1 rounded-xl border border-line bg-card px-3.5 py-2.5 text-sm outline-none focus-visible:border-terra";

export function GammesEditor({ initial }: { initial: string[] }) {
  const router = useRouter();
  const [gammes, setGammes] = useState<string[]>(initial);
  const [status, setStatus] = useState<"" | "saving" | "saved">("");
  const [msg, setMsg] = useState("");

  async function save() {
    const clean = gammes.map((g) => g.trim()).filter(Boolean);
    if (clean.length === 0) {
      setMsg("Au moins une gamme est requise.");
      return;
    }
    setStatus("saving");
    setMsg("");
    const res = await fetch("/api/admin/gammes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gammes: clean }),
    });
    if (res.ok) {
      setStatus("saved");
      router.refresh();
      setTimeout(() => setStatus(""), 2000);
    } else {
      setStatus("");
      setMsg("Erreur à l'enregistrement.");
    }
  }

  return (
    <section className="mt-10 border-t border-line pt-8">
      <h2 className="text-xl">Catégories (gammes)</h2>
      <p className="mt-1 text-sm text-muted">
        Utilisées comme filtres du catalogue et dans la fiche de chaque modèle.
      </p>
      <div className="mt-4 space-y-2">
        {gammes.map((g, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={g}
              onChange={(e) =>
                setGammes(gammes.map((x, idx) => (idx === i ? e.target.value : x)))
              }
              className={input}
            />
            <button
              type="button"
              onClick={() => setGammes(gammes.filter((_, idx) => idx !== i))}
              aria-label="Supprimer"
              className="shrink-0 rounded-lg px-2 py-2 text-muted hover:bg-cream hover:text-terra-dark"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setGammes([...gammes, ""])}
          className="text-sm font-medium text-terra hover:underline"
        >
          + Ajouter une catégorie
        </button>
      </div>

      <p className="mt-3 text-xs text-muted">
        Renommer une gamme ne met pas à jour les produits déjà classés dans
        l&apos;ancien nom : pensez à les reclasser dans l&apos;éditeur produit.
      </p>

      {msg && <p className="mt-3 text-sm text-terra-dark">{msg}</p>}

      <div className="mt-5 flex items-center gap-4">
        <button
          type="button"
          onClick={save}
          disabled={status === "saving"}
          className="rounded-full bg-terra px-7 py-3 font-semibold text-white hover:bg-terra-dark disabled:opacity-60"
        >
          {status === "saving" ? "Enregistrement…" : "Enregistrer les catégories"}
        </button>
        {status === "saved" && (
          <span className="text-sm text-[#00b67a]">Enregistré ✓</span>
        )}
      </div>
    </section>
  );
}
