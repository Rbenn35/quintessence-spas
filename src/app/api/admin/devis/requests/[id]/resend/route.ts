import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import {
  getDevisRequest,
  updateDevisRequest,
  getAllSpas,
  getDevisConfig,
  getSettings,
} from "@/lib/store";
import { buildDevis } from "@/lib/devis-generate";
import { sendMail, emailConfigured } from "@/lib/email";
import type { DevisLine } from "@/lib/devis";
import type { Spa } from "@/lib/spas";

/**
 * Régénère un devis avec des lignes modifiées (accessoires, installation…),
 * puis :
 *   - preview=true  → renvoie l'HTML régénéré sans rien enregistrer ni envoyer ;
 *   - sinon         → met à jour la demande, envoie l'e-mail au client et la
 *                     marque « envoyé ».
 *
 * Body JSON : { lines: DevisLine[], preview?: boolean }
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as {
    lines?: DevisLine[];
    preview?: boolean;
  } | null;

  const req = await getDevisRequest(id);
  if (!req) {
    return NextResponse.json(
      { ok: false, error: "Demande introuvable." },
      { status: 404 },
    );
  }
  if (req.type !== "devis") {
    return NextResponse.json(
      { ok: false, error: "Seuls les devis chiffrés peuvent être modifiés." },
      { status: 422 },
    );
  }

  const [spas, config, settings] = await Promise.all([
    getAllSpas(),
    getDevisConfig(),
    getSettings(),
  ]);

  // Résolution du produit : slug mémorisé, sinon libellé « Nom N places ».
  const product: Spa | undefined =
    (req.slug && spas.find((s) => s.slug === req.slug)) ||
    spas.find(
      (s) =>
        `${s.name} ${s.places} places`.toLowerCase() ===
          req.modeleLabel.toLowerCase() ||
        req.modeleLabel.toLowerCase().includes(s.name.toLowerCase()),
    );

  if (!product) {
    return NextResponse.json(
      { ok: false, error: "Modèle de spa introuvable pour ce devis." },
      { status: 422 },
    );
  }

  // Lignes choisies (envoyées par l'éditeur) ; à défaut, celles du devis.
  const lines: DevisLine[] = Array.isArray(body?.lines)
    ? body!.lines.map((l) => ({
        id: String(l.id),
        type: l.type,
        label: String(l.label),
        price: Number(l.price) || 0,
        active: true,
        ...(l.offered ? { offered: true } : {}),
        ...(l.description ? { description: String(l.description) } : {}),
      }))
    : (req.lines ?? config.lines.filter((l) => l.active));

  const baseUrl = new URL(request.url).origin;
  const now = new Date();
  const dateLabel = now.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const built = buildDevis({
    prenom: req.prenom,
    nom: req.nom,
    email: req.email,
    product,
    // On remplace les lignes globales par celles choisies pour ce devis.
    config: { ...config, lines },
    settings,
    ref: req.ref,
    dateLabel,
    baseUrl,
    ctaUrl: `${baseUrl}/devis/${id}/signer`,
  });

  // Aperçu seulement : on renvoie l'HTML sans enregistrer ni envoyer.
  if (body?.preview) {
    return NextResponse.json({
      ok: true,
      html: built.html,
      subject: built.subject,
      total: built.total,
    });
  }

  // Envoi réel + mise à jour de la demande.
  const sent = await sendMail({
    to: req.email,
    subject: built.subject,
    html: built.html,
  });

  await updateDevisRequest(id, {
    html: built.html,
    subject: built.subject,
    total: built.total,
    lines,
    slug: product.slug,
    ...(sent
      ? { status: "sent", sentAt: now.toISOString() }
      : {}),
    resendCount: (req.resendCount ?? 0) + 1,
  });

  return NextResponse.json({
    ok: true,
    emailConfigured,
    sent,
    total: built.total,
    note: sent
      ? "Devis modifié et renvoyé au client."
      : "Devis enregistré, mais e-mail non configuré : rien n'a été envoyé.",
  });
}
