"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Review } from "@/lib/reviews";

const input =
  "w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-sm outline-none focus-visible:border-terra";
const label = "block text-sm font-medium";

export function ReviewEditor({
  initial,
  isNew,
  products,
}: {
  initial: Review;
  isNew: boolean;
  products: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const [author, setAuthor] = useState(initial.author);
  const [city, setCity] = useState(initial.city ?? "");
  const [rating, setRating] = useState(initial.rating);
  const [text, setText] = useState(initial.text);
  const [productSlug, setProductSlug] = useState(initial.productSlug ?? "");
  const [published, setPublished] = useState(initial.published);
  const [status, setStatus] = useState<"" | "saving">("");
  const [msg, setMsg] = useState("");

  async function save() {
    if (!author.trim() || !text.trim()) {
      setMsg("L'auteur et l'avis sont obligatoires.");
      return;
    }
    const review: Review = {
      id: initial.id,
      author: author.trim(),
      ...(city.trim() ? { city: city.trim() } : {}),
      rating,
      text: text.trim(),
      ...(productSlug ? { productSlug } : {}),
      published,
    };
    setStatus("saving");
    setMsg("");
    const res = await fetch(
      isNew ? "/api/admin/reviews" : `/api/admin/reviews/${initial.id}`,
      {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      },
    );
    setStatus("");
    if (res.ok) {
      router.push("/admin/avis");
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setMsg(d.error || "Erreur à l'enregistrement.");
    }
  }

  async function remove() {
    if (!confirm("Supprimer cet avis ?")) return;
    await fetch(`/api/admin/reviews/${initial.id}`, { method: "DELETE" });
    router.push("/admin/avis");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/admin/avis" className="text-sm text-terra hover:underline">
        ← Retour aux avis
      </Link>
      <h1 className="mt-3 text-3xl">{isNew ? "Nouvel avis" : "Modifier l'avis"}</h1>

      <div className="mt-8 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Auteur</label>
            <input className={`mt-1.5 ${input}`} value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
          <div>
            <label className={label}>Ville (optionnel)</label>
            <input className={`mt-1.5 ${input}`} value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div>
            <label className={label}>Note</label>
            <select
              className={`mt-1.5 ${input}`}
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {"★".repeat(n)} ({n}/5)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Modèle concerné</label>
            <select
              className={`mt-1.5 ${input}`}
              value={productSlug}
              onChange={(e) => setProductSlug(e.target.value)}
            >
              <option value="">Tous les modèles (avis global)</option>
              {products.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={label}>Avis</label>
          <textarea rows={4} className={`mt-1.5 ${input}`} value={text} onChange={(e) => setText(e.target.value)} />
        </div>

        <label className="flex items-center gap-2.5 text-sm">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4"
          />
          Publié (visible sur le site)
        </label>

        {msg && <p className="text-sm text-terra-dark">{msg}</p>}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={save}
              disabled={status === "saving"}
              className="rounded-full bg-terra px-7 py-3 font-semibold text-white hover:bg-terra-dark disabled:opacity-60"
            >
              {status === "saving" ? "Enregistrement…" : "Enregistrer"}
            </button>
            <Link href="/admin/avis" className="rounded-full border border-line px-6 py-3 text-sm hover:bg-cream">
              Annuler
            </Link>
          </div>
          {!isNew && (
            <button type="button" onClick={remove} className="text-sm text-terra-dark hover:underline">
              Supprimer cet avis
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
