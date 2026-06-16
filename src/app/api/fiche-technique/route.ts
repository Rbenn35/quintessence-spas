import { NextResponse } from "next/server";
import { addMessage, getSpaBySlug } from "@/lib/store";
import { sendMail, CONTACT_EMAIL } from "@/lib/email";

/**
 * Demande de fiche technique : capte le lead (prénom, nom, e-mail) dans le
 * back-office (onglet « Messages »), puis le client télécharge le PDF.
 *
 * ⚠️ L'envoi d'e-mail n'est PAS encore actif (action sensible) : on stocke le
 * lead et on renvoie l'URL de la fiche. Brancher l'envoi à « TODO email ».
 */
interface Payload {
  prenom?: string;
  nom?: string;
  email?: string;
  slug?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

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
    !data.slug?.trim()
  ) {
    return NextResponse.json(
      { ok: false, error: "Champs obligatoires manquants ou e-mail invalide." },
      { status: 422 },
    );
  }

  const spa = await getSpaBySlug(data.slug.trim());
  if (!spa) {
    return NextResponse.json(
      { ok: false, error: "Modèle introuvable." },
      { status: 404 },
    );
  }

  const modele = `${spa.name} ${spa.places} places`;
  await addMessage({
    id: `f-${Date.now()}-${Math.round(Math.random() * 1000)}`,
    prenom: data.prenom.trim(),
    nom: data.nom.trim(),
    email: data.email.trim(),
    sujet: `Téléchargement fiche technique — ${modele}`,
    message: `Demande de fiche technique du ${modele} (téléchargement PDF depuis la fiche produit).`,
    date: new Date().toISOString(),
    read: false,
  });

  // Notification e-mail du lead à l'adresse de contact (si SMTP configuré).
  if (CONTACT_EMAIL) {
    await sendMail({
      to: CONTACT_EMAIL,
      replyTo: data.email.trim(),
      subject: `Téléchargement fiche technique — ${modele}`,
      html: `<p><strong>${data.prenom.trim()} ${data.nom.trim()}</strong> (${data.email.trim()}) a téléchargé la fiche technique du <strong>${modele}</strong>.</p>`,
    });
  }

  return NextResponse.json({
    ok: true,
    downloadUrl: `/spas/${spa.slug}/fiche-technique`,
  });
}
