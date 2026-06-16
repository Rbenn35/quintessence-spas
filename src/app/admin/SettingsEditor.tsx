"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteSettings } from "@/lib/settings";

const input =
  "w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-sm outline-none focus-visible:border-terra";
const label = "block text-sm font-medium";

export function SettingsEditor({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const [name, setName] = useState(initial.name);
  const [email, setEmail] = useState(initial.email);
  const [description, setDescription] = useState(initial.description);
  const [years, setYears] = useState(initial.stats.yearsExperience);
  const [installed, setInstalled] = useState(initial.stats.spasInstalled);
  const [rating, setRating] = useState(initial.stats.rating);
  const [warranty, setWarranty] = useState(initial.stats.warranty);
  const [status, setStatus] = useState<"" | "saving" | "saved">("");
  const [msg, setMsg] = useState("");

  async function save() {
    if (!name.trim() || !email.trim()) {
      setMsg("Le nom et l'email sont obligatoires.");
      return;
    }
    const settings: SiteSettings = {
      name: name.trim(),
      email: email.trim(),
      description: description.trim(),
      stats: {
        yearsExperience: years.trim(),
        spasInstalled: installed.trim(),
        rating: rating.trim(),
        warranty: warranty.trim(),
      },
    };
    setStatus("saving");
    setMsg("");
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (res.ok) {
      setStatus("saved");
      router.refresh();
      setTimeout(() => setStatus(""), 2000);
    } else {
      setStatus("");
      const d = await res.json().catch(() => ({}));
      setMsg(d.error || "Erreur à l'enregistrement.");
    }
  }

  return (
    <div className="mt-8 space-y-8">
      <section>
        <h2 className="text-xl">Informations générales</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className={label}>Nom du site</label>
            <input className={`mt-1.5 ${input}`} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className={label}>Email de contact</label>
            <input className={`mt-1.5 ${input}`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className={label}>Description (SEO)</label>
            <textarea rows={3} className={`mt-1.5 ${input}`} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl">Chiffres de réassurance</h2>
        <p className="mt-1 text-sm text-muted">
          Affichés sur le site (bandeau « +15 ans », « 2 400 spas installés »…).
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Années d&apos;expérience</label>
            <input className={`mt-1.5 ${input}`} value={years} onChange={(e) => setYears(e.target.value)} />
          </div>
          <div>
            <label className={label}>Spas installés</label>
            <input className={`mt-1.5 ${input}`} value={installed} onChange={(e) => setInstalled(e.target.value)} />
          </div>
          <div>
            <label className={label}>Note clients</label>
            <input className={`mt-1.5 ${input}`} value={rating} onChange={(e) => setRating(e.target.value)} />
          </div>
          <div>
            <label className={label}>Garantie</label>
            <input className={`mt-1.5 ${input}`} value={warranty} onChange={(e) => setWarranty(e.target.value)} />
          </div>
        </div>
      </section>

      {msg && <p className="text-sm text-terra-dark">{msg}</p>}

      <div className="flex items-center gap-4 border-t border-line pt-6">
        <button
          type="button"
          onClick={save}
          disabled={status === "saving"}
          className="rounded-full bg-terra px-7 py-3 font-semibold text-white hover:bg-terra-dark disabled:opacity-60"
        >
          {status === "saving" ? "Enregistrement…" : "Enregistrer"}
        </button>
        {status === "saved" && (
          <span className="text-sm text-[#00b67a]">Enregistré ✓</span>
        )}
      </div>
    </div>
  );
}
