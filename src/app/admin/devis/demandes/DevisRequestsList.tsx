"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DevisRequest } from "@/lib/devis-requests";

function fmt(iso: string): string {
  try {
    return new Date(iso).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

const euro = (n: number) => `${n.toLocaleString("fr-FR")} €`;

export function DevisRequestsList({
  requests,
}: {
  requests: DevisRequest[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string>("");

  async function patch(id: string, status: DevisRequest["status"]) {
    setBusy(id);
    await fetch(`/api/admin/devis/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy("");
    router.refresh();
  }

  async function remove(r: DevisRequest) {
    if (!confirm(`Supprimer la demande de ${r.prenom} ${r.nom} ?`)) return;
    setBusy(r.id);
    await fetch(`/api/admin/devis/requests/${r.id}`, { method: "DELETE" });
    setBusy("");
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {requests.map((r) => {
        const sent = r.status === "sent";
        const cancelled = r.status === "cancelled";
        return (
          <div
            key={r.id}
            className={`rounded-2xl border p-5 ${
              r.status === "pending"
                ? "border-terra/40 bg-terra/5"
                : "border-line bg-card"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">
                    {r.prenom} {r.nom}
                  </span>
                  <a
                    href={`mailto:${r.email}`}
                    className="text-sm text-terra hover:underline"
                  >
                    {r.email}
                  </a>
                  <span className="rounded-full bg-olive/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-olive">
                    {r.type === "info" ? "Demande d'infos" : "Devis"}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      sent
                        ? "bg-[#00b67a]/10 text-[#00917f]"
                        : cancelled
                          ? "bg-line/60 text-muted"
                          : "bg-terra/10 text-terra"
                    }`}
                  >
                    {sent ? "Envoyé" : cancelled ? "Annulé" : "À envoyer"}
                  </span>
                </div>
                <div className="mt-1 text-xs text-muted">
                  {r.type === "info"
                    ? r.modeleLabel
                    : `${r.ref} · ${r.modeleLabel} · ${euro(r.total)}`}{" "}
                  ·{" "}
                  {r.status === "pending"
                    ? `envoi prévu ${fmt(r.sendAt)}`
                    : sent && r.sentAt
                      ? `envoyé ${fmt(r.sentAt)}`
                      : `reçu ${fmt(r.createdAt)}`}
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2 text-sm">
                <a
                  href={`/admin/devis/demandes/${r.id}/apercu`}
                  target="_blank"
                  className="rounded-lg border border-line px-3 py-1.5 hover:bg-cream"
                >
                  Aperçu
                </a>
                {r.status === "pending" ? (
                  <button
                    type="button"
                    disabled={busy === r.id}
                    onClick={() => patch(r.id, "sent")}
                    className="rounded-lg bg-terra px-3 py-1.5 font-medium text-white hover:bg-terra-dark disabled:opacity-60"
                  >
                    Marquer envoyé
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={busy === r.id}
                    onClick={() => patch(r.id, "pending")}
                    className="rounded-lg border border-line px-3 py-1.5 hover:bg-cream"
                  >
                    Remettre à envoyer
                  </button>
                )}
                <button
                  type="button"
                  disabled={busy === r.id}
                  onClick={() => remove(r)}
                  className="rounded-lg border border-line px-3 py-1.5 text-muted hover:bg-cream hover:text-terra-dark"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
