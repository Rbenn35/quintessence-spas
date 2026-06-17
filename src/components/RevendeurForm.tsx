"use client";

import { useState } from "react";
import { formatPrenom, formatNom, formatPhone } from "@/lib/format";

type Status = "idle" | "sending" | "success" | "error";

const inputClass =
  "w-full rounded-xl border border-line bg-card px-4 py-3 text-base outline-none focus-visible:border-terra";
const labelClass = "block text-sm font-medium";

const ACTIVITES = [
  "Pisciniste",
  "Paysagiste",
  "Revendeur de spas",
  "Magasin spa / bien-être",
  "Constructeur / promoteur",
  "Autre",
];

export function RevendeurForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/revendeur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Échec");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-line bg-cream p-8 text-center">
        <h2 className="text-2xl">Candidature envoyée !</h2>
        <p className="mt-3 text-muted">
          Merci pour votre intérêt. Notre équipe revendeurs étudie votre demande
          et revient vers vous sous 48&nbsp;h ouvrées avec nos conditions et
          tarifs professionnels.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 rounded-full border-[1.5px] border-ink px-6 py-3 text-sm font-medium transition-colors hover:bg-ink hover:text-cream"
        >
          Envoyer une autre candidature
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="societe">
            Société / enseigne
          </label>
          <input
            id="societe"
            name="societe"
            required
            className={`mt-1.5 ${inputClass}`}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="siteweb">
            Site internet
          </label>
          <input
            id="siteweb"
            name="siteweb"
            type="url"
            placeholder="https://votre-site.fr"
            className={`mt-1.5 ${inputClass}`}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="activite">
          Votre activité
        </label>
        <select
          id="activite"
          name="activite"
          required
          defaultValue=""
          className={`mt-1.5 ${inputClass}`}
        >
          <option value="" disabled>
            Sélectionnez…
          </option>
          {ACTIVITES.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

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

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="email">
            E-mail professionnel
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
          <label className={labelClass} htmlFor="telephone">
            Téléphone
          </label>
          <input
            id="telephone"
            name="telephone"
            type="tel"
            autoComplete="tel"
            onBlur={(e) => {
              e.currentTarget.value = formatPhone(e.currentTarget.value);
            }}
            className={`mt-1.5 ${inputClass}`}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="message">
          Votre projet (optionnel)
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className={`mt-1.5 ${inputClass}`}
          placeholder="Zone géographique, volume envisagé, showroom existant, attentes…"
        />
      </div>

      {status === "error" && (
        <p className="rounded-xl bg-terra/10 px-4 py-3 text-sm text-terra-dark">
          Une erreur est survenue. Réessayez ou écrivez-nous directement.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-terra px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-terra-dark disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? "Envoi…" : "Envoyer ma candidature"}
      </button>

      <p className="text-xs text-muted">
        Réservé aux professionnels. Vos données ne sont jamais cédées à des
        tiers.
      </p>
    </form>
  );
}
