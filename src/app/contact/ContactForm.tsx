"use client";

import { useState } from "react";
import { formatPrenom, formatNom } from "@/lib/format";

type Status = "idle" | "sending" | "success" | "error";

const inputClass =
  "w-full rounded-xl border border-line bg-card px-4 py-3 text-base outline-none focus-visible:border-terra";
const labelClass = "block text-sm font-medium";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/contact", {
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
        <h2 className="text-2xl">Message envoyé !</h2>
        <p className="mt-3 text-muted">
          Merci, nous avons bien reçu votre message. Notre équipe vous répond
          sous 48&nbsp;h ouvrées.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 rounded-full border-[1.5px] border-ink px-6 py-3 text-sm font-medium transition-colors hover:bg-ink hover:text-cream"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
            onBlur={(e) => {
              e.currentTarget.value = formatPrenom(e.currentTarget.value);
            }}
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
            onBlur={(e) => {
              e.currentTarget.value = formatNom(e.currentTarget.value);
            }}
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

      <div>
        <label className={labelClass} htmlFor="sujet">
          Sujet
        </label>
        <input
          id="sujet"
          name="sujet"
          className={`mt-1.5 ${inputClass}`}
          placeholder="Une question sur un modèle, une commande…"
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="message">
          Votre message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className={`mt-1.5 ${inputClass}`}
          placeholder="Comment pouvons-nous vous aider ?"
        />
      </div>

      {status === "error" && (
        <p className="rounded-xl bg-terra/10 px-4 py-3 text-sm text-terra-dark">
          Une erreur est survenue. Réessayez ou écrivez-nous directement par
          email.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-terra px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-terra-dark disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? "Envoi…" : "Envoyer le message"}
      </button>

      <p className="text-xs text-muted">
        En envoyant ce formulaire, vous acceptez d&apos;être recontacté par
        Quintessence Spas. Vos données ne sont jamais cédées à des tiers.
      </p>
    </form>
  );
}
