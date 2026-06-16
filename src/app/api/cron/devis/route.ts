import { NextResponse } from "next/server";
import { getAllDevisRequests, updateDevisRequest } from "@/lib/store";
import { sendMail, emailConfigured } from "@/lib/email";

/**
 * Déclencheur d'envoi des devis arrivés à échéance.
 * À appeler périodiquement par un planificateur (Vercel Cron), idéalement
 * toutes les 5 minutes. Protéger par CRON_SECRET en production.
 *
 * Si l'e-mail est configuré (SMTP), chaque devis dû est envoyé puis marqué
 * « envoyé ». Sinon, la route liste seulement les devis dus.
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

  let sent = 0;
  if (emailConfigured) {
    for (const r of due) {
      const ok = await sendMail({
        to: r.email,
        subject: r.subject,
        html: r.html,
      });
      if (ok) {
        await updateDevisRequest(r.id, {
          status: "sent",
          sentAt: new Date().toISOString(),
        });
        sent++;
      }
    }
  }

  return NextResponse.json({
    ok: true,
    emailConfigured,
    due: due.length,
    sent,
    refs: due.map((r) => r.ref),
    note: emailConfigured
      ? `${sent}/${due.length} devis envoyé(s).`
      : "Devis dus identifiés. Configurez SMTP pour activer l'envoi automatique.",
  });
}
