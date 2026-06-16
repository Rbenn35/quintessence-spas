import { NextResponse } from "next/server";
import { addMessage } from "@/lib/store";
import { sendMail, CONTACT_EMAIL } from "@/lib/email";

/**
 * Réception des messages du formulaire de contact.
 * Les messages sont stockés dans le back-office (onglet « Messages »).
 *
 * ⚠️ L'envoi d'email n'est PAS encore actif (action sensible) : la route
 * stocke et journalise, puis renvoie un succès. Brancher un service email
 * à l'endroit « TODO email » le moment venu.
 */
interface ContactPayload {
  prenom?: string;
  nom?: string;
  email?: string;
  sujet?: string;
  message?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let data: ContactPayload;
  try {
    data = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Requête invalide." },
      { status: 400 },
    );
  }

  if (
    !data.prenom ||
    !data.nom ||
    !data.email ||
    !isValidEmail(data.email) ||
    !data.message
  ) {
    return NextResponse.json(
      { ok: false, error: "Champs obligatoires manquants ou email invalide." },
      { status: 422 },
    );
  }

  // Stockage dans le back-office.
  await addMessage({
    id: `m-${Date.now()}-${Math.round(Math.random() * 1000)}`,
    prenom: data.prenom,
    nom: data.nom,
    email: data.email,
    ...(data.sujet?.trim() ? { sujet: data.sujet.trim() } : {}),
    message: data.message,
    date: new Date().toISOString(),
    read: false,
  });

  // Notification e-mail à l'adresse de contact (si SMTP configuré).
  if (CONTACT_EMAIL) {
    const esc = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    await sendMail({
      to: CONTACT_EMAIL,
      replyTo: data.email,
      subject: `Nouveau message de contact${data.sujet ? ` — ${data.sujet}` : ""}`,
      html: `<p><strong>${esc(data.prenom)} ${esc(data.nom)}</strong> (${esc(data.email)})</p><p>${esc(data.message).replace(/\n/g, "<br>")}</p>`,
    });
  }

  return NextResponse.json({ ok: true });
}
