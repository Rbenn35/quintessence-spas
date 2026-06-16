"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Accessoire } from "@/lib/accessoires";

const input =
  "w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-sm outline-none focus-visible:border-terra";
const label = "block text-sm font-medium";

export function AccessoireEditor({
  initial,
  isNew,
}: {
  initial: Accessoire;
  isNew: boolean;
}) {
  const router = useRouter();
  const [name, setName] = useState(initial.name);
  const [description, setDescription] = useState(initial.description);
  const [price, setPrice] = useState(
    initial.price != null ? String(initial.price) : "",
  );
  const [image, setImage] = useState(initial.image ?? "");
  const [active, setActive] = useState(initial.active);
  const [status, setStatus] = useState<"" | "saving">("");
  const [msg, setMsg] = useState("");

  async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (res.ok) setImage((await res.json()).path);
    e.target.value = "";
  }

  async function save() {
    if (!name.trim()) {
      setMsg("Le nom est obligatoire.");
      return;
    }
    const item: Accessoire = {
      id: initial.id,
      name: name.trim(),
      description: description.trim(),
      price: price.trim() === "" ? null : Number(price),
      ...(image ? { image } : {}),
      active,
    };
    setStatus("saving");
    setMsg("");
    const res = await fetch(
      isNew ? "/api/admin/accessoires" : `/api/admin/accessoires/${initial.id}`,
      {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      },
    );
    setStatus("");
    if (res.ok) {
      router.push("/admin/accessoires");
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setMsg(d.error || "Erreur à l'enregistrement.");
    }
  }

  async function remove() {
    if (!confirm(`Supprimer l'accessoire « ${initial.name} » ?`)) return;
    await fetch(`/api/admin/accessoires/${initial.id}`, { method: "DELETE" });
    router.push("/admin/accessoires");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link
        href="/admin/accessoires"
        className="text-sm text-terra hover:underline"
      >
        ← Retour aux accessoires
      </Link>
      <h1 className="mt-3 text-3xl">
        {isNew ? "Nouvel accessoire" : `Modifier · ${initial.name}`}
      </h1>

      <div className="mt-8 space-y-5">
        <div>
          <label className={label}>Nom</label>
          <input className={`mt-1.5 ${input}`} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className={label}>Description</label>
          <textarea rows={2} className={`mt-1.5 ${input}`} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label className={label}>Prix (€, vide = sur devis)</label>
          <input type="number" className={`mt-1.5 ${input} max-w-xs`} value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>

        <div>
          <label className={label}>Image</label>
          <div className="mt-2 flex items-center gap-4">
            <div
              className="h-20 w-28 shrink-0 rounded-xl border border-line bg-cover bg-center"
              style={{
                backgroundImage: image
                  ? `url('${image}')`
                  : "linear-gradient(150deg,#cfe2ea,#1c6e8e)",
              }}
            />
            <label className="cursor-pointer rounded-lg border border-line bg-card px-3 py-1.5 text-sm hover:bg-cream">
              Téléverser
              <input type="file" accept="image/*" className="hidden" onChange={uploadImage} />
            </label>
            {image && (
              <button
                type="button"
                className="rounded-lg border border-line bg-card px-3 py-1.5 text-sm hover:bg-cream"
                onClick={() => setImage("")}
              >
                Retirer
              </button>
            )}
          </div>
        </div>

        <label className="flex items-center gap-2.5 text-sm">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="h-4 w-4"
          />
          Affiché sur les fiches produit
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
            <Link href="/admin/accessoires" className="rounded-full border border-line px-6 py-3 text-sm hover:bg-cream">
              Annuler
            </Link>
          </div>
          {!isNew && (
            <button type="button" onClick={remove} className="text-sm text-terra-dark hover:underline">
              Supprimer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
