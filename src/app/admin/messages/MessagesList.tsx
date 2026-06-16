"use client";

import { useState } from "react";
import type { ContactMessage } from "@/lib/messages";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function MessagesList({
  messages: initial,
}: {
  messages: ContactMessage[];
}) {
  const [messages, setMessages] = useState(initial);

  async function toggleRead(m: ContactMessage) {
    const read = !m.read;
    setMessages((list) =>
      list.map((x) => (x.id === m.id ? { ...x, read } : x)),
    );
    await fetch(`/api/admin/messages/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });
  }

  async function remove(m: ContactMessage) {
    if (!confirm(`Supprimer le message de ${m.prenom} ${m.nom} ?`)) return;
    setMessages((list) => list.filter((x) => x.id !== m.id));
    await fetch(`/api/admin/messages/${m.id}`, { method: "DELETE" });
  }

  return (
    <div className="space-y-3">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`rounded-2xl border p-5 ${
            m.read ? "border-line bg-card" : "border-terra/40 bg-terra/5"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                {!m.read && (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-terra" />
                )}
                <span className="font-medium">
                  {m.prenom} {m.nom}
                </span>
                <a
                  href={`mailto:${m.email}`}
                  className="text-sm text-terra hover:underline"
                >
                  {m.email}
                </a>
              </div>
              <div className="mt-0.5 text-xs text-muted">
                {formatDate(m.date)}
                {m.sujet && <> · {m.sujet}</>}
              </div>
            </div>
            <div className="flex shrink-0 gap-2 text-sm">
              <a
                href={`mailto:${m.email}?subject=${encodeURIComponent(
                  m.sujet ? `Re : ${m.sujet}` : "Votre message — Quintessence Spas",
                )}`}
                className="rounded-lg bg-terra px-3 py-1.5 font-medium text-white hover:bg-terra-dark"
              >
                Répondre
              </a>
              <button
                type="button"
                onClick={() => toggleRead(m)}
                className="rounded-lg border border-line px-3 py-1.5 hover:bg-cream"
              >
                {m.read ? "Marquer non lu" : "Marquer lu"}
              </button>
              <button
                type="button"
                onClick={() => remove(m)}
                className="rounded-lg border border-line px-3 py-1.5 text-muted hover:bg-cream hover:text-terra-dark"
              >
                Supprimer
              </button>
            </div>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm text-ink">
            {m.message}
          </p>
        </div>
      ))}
    </div>
  );
}
