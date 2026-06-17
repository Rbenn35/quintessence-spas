import { NextResponse } from "next/server";
import { addMessage } from "@/lib/store";
import { sendMail, CONTACT_EMAIL } from "@/lib/email";

/**
 * Candidature « Devenir revendeur » (B2B).
 * Capte le lead dans le back-office (onglet Messages) + notification e-mail.
 */
interface Payload {
  prenom?: string;
  nom?: string;
  email?: string;
  telephone?: string;
  societe?: string;
  activite?: string;
  message?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(request: Request) {
  let data: Payload;
  try {
    data = (await request.json()) as Payload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Requête invalide." },
      { status: 400 },
    );
  }

  if (
    !data.prenom?.trim() ||
    !data.nom?.trim() ||
    !data.email?.trim() ||
    !isValidEmail(data.email) ||
    !data.societe?.trim()
  ) {
    return NextResponse.json(
      { ok: false, error: "Champs obligatoires manquants ou e-mail invalide." },
      { status: 422 },
    );
  }

  const societe = data.societe.trim();
  const activite = (data.activite || "Non précisé").trim();
  const telephone = (data.telephone || "").trim();

  const details = [
    `Société : ${societe}`,
    `Activité : ${activite}`,
    telephone ? `Téléphone : ${telephone}` : null,
    "",
    data.message?.trim() || "(aucun message)",
  ]
    .filter((l) => l !== null)
    .join("\n");

  await addMessage({
    id: `rev-${Date.now()}-${Math.round(Math.random() * 1000)}`,
    prenom: data.prenom.trim(),
    nom: data.nom.trim(),
    email: data.email.trim(),
    sujet: `Candidature revendeur — ${societe} (${activite})`,
    message: details,
    date: new Date().toISOString(),
    read: false,
  });

  if (CONTACT_EMAIL) {
    await sendMail({
      to: CONTACT_EMAIL,
      replyTo: data.email.trim(),
      subject: `Nouvelle candidature revendeur — ${esc(societe)}`,
      html: `<p><strong>${esc(data.prenom.trim())} ${esc(data.nom.trim())}</strong> — ${esc(societe)} (${esc(activite)})</p>
<p>E-mail : ${esc(data.email.trim())}${telephone ? ` · Tél : ${esc(telephone)}` : ""}</p>
<p>${esc(data.message?.trim() || "(aucun message)").replace(/\n/g, "<br>")}</p>`,
    });
  }

  return NextResponse.json({ ok: true });
}
