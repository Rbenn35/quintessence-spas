"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

const inputClass =
  "w-full rounded-xl border border-line bg-card px-4 py-3.5 text-base outline-none focus-visible:border-terra";
const labelClass = "block text-sm font-medium";

/**
 * Formulaire de devis volontairement minimal : on ne demande que les
 * coordonnées (prénom, nom, email). Le modèle est transmis
 * automatiquement quand on arrive depuis une fiche produit.
 */
export function DevisForm({
  modele,
  slug,
}: {
  modele?: string;
  slug?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Échec de l'envoi");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-line bg-cream p-8 text-center">
        <h2 className="text-2xl">Merci, c'est noté !</h2>
        <p className="mt-3 text-muted">
          {modele
            ? `Votre demande pour le ${modele} est bien reçue. `
            : "Votre demande est bien reçue. "}
          Un conseiller vous recontacte sous 48&nbsp;h avec votre devis
          personnalisé.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {modele && <input type="hidden" name="modele" value={modele} />}
      {slug && <input type="hidden" name="slug" value={slug} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="prenom">
            Prénom
          </label>
          <input
            id="prenom"
            name="prenom"
            autoComplete="given-name"
            required
            className={`mt-1.5 ${inputClass}`}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="nom">
            Nom
          </label>
          <input
            id="nom"
            name="nom"
            autoComplete="family-name"
            required
            className={`mt-1.5 ${inputClass}`}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={`mt-1.5 ${inputClass}`}
        />
      </div>

      {status === "error" && (
        <p className="rounded-xl bg-terra/10 px-4 py-3 text-sm text-terra-dark">
          Une erreur est survenue. Réessayez ou appelez-nous directement.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-terra px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-terra-dark disabled:opacity-60"
      >
        {status === "sending" ? "Envoi…" : "Recevoir mon devis gratuit"}
      </button>

      <p className="text-center text-xs text-muted">
        Réponse sous 48&nbsp;h · Sans engagement · Vos données ne sont jamais
        cédées à des tiers.
      </p>
    </form>
  );
}
