"use client";

import { useState } from "react";
import { formatPrenom, formatNom } from "@/lib/format";

const field =
  "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus-visible:border-terra";

export function FicheTechniqueButton({
  slug,
  name,
}: {
  slug: string;
  name: string;
}) {
  const [open, setOpen] = useState(false);
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"" | "sending" | "done">("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const res = await fetch("/api/fiche-technique", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prenom, nom, email, slug }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.downloadUrl) {
      setStatus("done");
      // Ouvre la fiche imprimable (téléchargement / « Enregistrer en PDF »).
      window.open(data.downloadUrl, "_blank", "noopener");
    } else {
      setStatus("");
      setError(data.error || "Une erreur est survenue. Réessayez.");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border-[1.5px] border-ink px-7 py-3.5 text-sm font-medium tracking-wide text-ink transition-colors hover:bg-ink hover:text-cream"
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <path d="M7 10l5 5 5-5" />
          <path d="M12 15V3" />
        </svg>
        Télécharger la fiche technique
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
          onClick={() => status !== "sending" && setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Télécharger la fiche technique"
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer"
              className="float-right -mr-1 -mt-1 rounded-lg px-2 py-1 text-muted hover:bg-cream hover:text-ink"
            >
              ✕
            </button>
            <h2 className="font-serif text-2xl text-ink">
              Fiche technique du {name}
            </h2>

            {status === "done" ? (
              <div className="mt-4">
                <p className="text-sm text-muted">
                  Merci ! Votre fiche s&apos;ouvre dans un nouvel onglet.
                  Utilisez le bouton{" "}
                  <strong className="text-ink">« Enregistrer en PDF »</strong>{" "}
                  pour la conserver.
                </p>
                <a
                  href={`/spas/${slug}/fiche-technique`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex rounded-full bg-terra px-5 py-2.5 text-sm font-semibold text-white hover:bg-terra-dark"
                >
                  Rouvrir la fiche
                </a>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-4 space-y-3">
                <p className="text-sm text-muted">
                  Renseignez vos coordonnées pour recevoir et télécharger la
                  fiche technique complète.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    required
                    placeholder="Prénom"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    onBlur={(e) => setPrenom(formatPrenom(e.target.value))}
                    className={field}
                  />
                  <input
                    required
                    placeholder="Nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    onBlur={(e) => setNom(formatNom(e.target.value))}
                    className={field}
                  />
                </div>
                <input
                  required
                  type="email"
                  placeholder="Adresse e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={field}
                />
                {error && <p className="text-sm text-terra-dark">{error}</p>}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full rounded-full bg-terra px-7 py-3 text-sm font-semibold text-white hover:bg-terra-dark disabled:opacity-60"
                >
                  {status === "sending"
                    ? "Préparation…"
                    : "Télécharger la fiche technique"}
                </button>
                <p className="text-center text-xs text-muted">
                  Sans engagement · vos données restent confidentielles
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
