import { NextResponse } from "next/server";
import { getDevisRequest, updateDevisRequest, getSettings } from "@/lib/store";
import { sendMail } from "@/lib/email";
import type { DevisAddress } from "@/lib/devis-requests";

export const dynamic = "force-dynamic";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function cleanAddr(a: unknown): DevisAddress | undefined {
  if (!a || typeof a !== "object") return undefined;
  const o = a as Record<string, unknown>;
  const address = String(o.address ?? "").trim();
  const cp = String(o.cp ?? "").trim();
  const city = String(o.city ?? "").trim();
  const phone = String(o.phone ?? "").trim();
  if (!address && !cp && !city && !phone) return undefined;
  return { address, cp, city, ...(phone ? { phone } : {}) };
}

const fmtAddr = (a?: DevisAddress) =>
  a ? `${a.address}, ${a.cp} ${a.city}${a.phone ? ` — ${a.phone}` : ""}` : "—";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as {
    signerName?: string;
    signatureDataUrl?: string;
    billing?: unknown;
    delivery?: unknown;
  } | null;

  const req = await getDevisRequest(id);
  if (!req || req.type !== "devis") {
    return NextResponse.json(
      { ok: false, error: "Devis introuvable." },
      { status: 404 },
    );
  }
  if (req.signed) {
    return NextResponse.json({ ok: true, alreadySigned: true });
  }

  const signerName = String(body?.signerName ?? "").trim();
  const signatureDataUrl = String(body?.signatureDataUrl ?? "");
  const billing = cleanAddr(body?.billing);
  const delivery = cleanAddr(body?.delivery);

  if (!signerName) {
    return NextResponse.json(
      { ok: false, error: "Nom du signataire requis." },
      { status: 422 },
    );
  }
  if (!signatureDataUrl.startsWith("data:image/")) {
    return NextResponse.json(
      { ok: false, error: "Signature manquante." },
      { status: 422 },
    );
  }
  if (!billing) {
    return NextResponse.json(
      { ok: false, error: "Adresse de facturation requise." },
      { status: 422 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "inconnue";
  const now = new Date();
  const dateLabel = now.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  await updateDevisRequest(id, {
    signed: true,
    signedAt: now.toISOString(),
    signerIp: ip,
    signerName,
    signatureDataUrl,
    billing,
    ...(delivery ? { delivery } : {}),
  });

  // E-mails (best effort, n'empêchent pas la validation).
  const settings = await getSettings();
  const baseUrl = new URL(request.url).origin;
  const valideUrl = `${baseUrl}/devis/${id}/valide`;
  const euro = (n: number) => `${n.toLocaleString("fr-FR")} €`;

  // → Confirmation à l'entreprise
  await sendMail({
    to: settings.email,
    subject: `Devis ${req.ref} signé par ${signerName}`,
    html: `<div style="font-family:Arial,sans-serif;color:#13313d;line-height:1.6">
      <h2>Devis ${esc(req.ref)} validé et signé ✓</h2>
      <p><b>${esc(signerName)}</b> a signé le devis <b>${esc(req.ref)}</b> (${esc(req.modeleLabel)}, ${euro(req.total)} TTC).</p>
      <ul>
        <li>Date / heure : ${esc(dateLabel)}</li>
        <li>Adresse IP : ${esc(ip)}</li>
        <li>E-mail client : ${esc(req.email)}</li>
        <li>Facturation : ${esc(fmtAddr(billing))}</li>
        <li>Livraison : ${esc(delivery ? fmtAddr(delivery) : "identique à la facturation")}</li>
      </ul>
      <p>Signature :</p>
      <img src="${signatureDataUrl}" alt="Signature" style="max-width:320px;border:1px solid #e6e9ec;border-radius:8px" />
      <p><a href="${valideUrl}" style="color:#1c6e8e">Voir le devis validé</a></p>
    </div>`,
  });

  // → Devis validé au client
  await sendMail({
    to: req.email,
    replyTo: settings.email,
    subject: `Votre devis ${req.ref} est validé`,
    html: `<div style="font-family:Arial,sans-serif;color:#13313d;line-height:1.6;max-width:560px;margin:0 auto">
      <div style="text-align:center;margin-bottom:18px"><a href="${baseUrl}"><img src="${baseUrl}/brand/logo.png" alt="Quintessence Spas" style="height:42px;border:0" /></a></div>
      <h2 style="text-align:center">Votre devis est validé ✓</h2>
      <p>Bonjour ${esc(req.prenom)},</p>
      <p>Votre devis <b>${esc(req.ref)}</b> pour le <b>${esc(req.modeleLabel)}</b> (${euro(req.total)} TTC) a bien été signé et validé le ${esc(dateLabel)}.</p>
      <p>Vous pouvez consulter et télécharger votre devis validé en PDF ici :</p>
      <p style="text-align:center;margin:24px 0">
        <a href="${valideUrl}" style="background:#1b2a37;color:#fff;text-decoration:none;padding:14px 26px;border-radius:40px;font-weight:600">Télécharger mon devis (PDF)</a>
      </p>
      <p>Notre équipe vous recontacte rapidement pour la suite. À très vite !</p>
      <p style="color:#6b7c84;font-size:13px">Quintessence Spas · 14 Avenue des Vignes, 17320 Saint-Just-Luzac · ${esc(settings.email)}</p>
    </div>`,
  });

  return NextResponse.json({ ok: true, redirect: `/devis/${id}/valide` });
}
