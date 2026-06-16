import { NextResponse } from "next/server";
import { getAllDevisRequests } from "@/lib/store";

/**
 * Déclencheur d'envoi des devis arrivés à échéance.
 * À appeler périodiquement par un planificateur (cron de l'hébergeur) une fois
 * déployé, idéalement toutes les 5 minutes.
 *
 * ⚠️ L'envoi réel n'est PAS actif : il faut d'abord brancher un service email
 * et, en production, protéger cette route par un secret (CRON_SECRET).
 * Tant que ce n'est pas fait, cette route se contente de LISTER les devis dus
 * sans les marquer envoyés (pour ne rien prétendre faussement).
 */
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
  }

  const now = Date.now();
  const due = (await getAllDevisRequests()).filter(
    (r) => r.status === "pending" && Date.parse(r.sendAt) <= now,
  );

  // TODO email — pour chaque devis dû :
  //   await sendEmail({ to: r.email, subject: r.subject, html: r.html });
  //   await updateDevisRequest(r.id, { status: "sent", sentAt: new Date().toISOString() });

  return NextResponse.json({
    ok: true,
    emailConfigured: false,
    due: due.length,
    refs: due.map((r) => r.ref),
    note: "Devis dus identifiés. Branchez l'email pour activer l'envoi automatique.",
  });
}
