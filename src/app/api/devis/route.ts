import { NextResponse } from "next/server";
import {
  getAllSpas,
  getDevisConfig,
  getSettings,
  getAllDevisRequests,
  addDevisRequest,
} from "@/lib/store";
import { buildDevis, buildInfoEmail } from "@/lib/devis-generate";

/**
 * Réception d'une demande de devis.
 * Le document est généré et figé (HTML + objet), puis mis en file pour envoi
 * automatique à J+délai (back-office → Devis → Demandes).
 *
 * ⚠️ L'envoi d'email n'est PAS encore actif (action sensible). Les devis
 * restent « à envoyer » jusqu'à ce que l'email + le planificateur soient
 * branchés (voir /api/cron/devis).
 */
interface DevisPayload {
  modele?: string;
  slug?: string;
  prenom?: string;
  nom?: string;
  email?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let data: DevisPayload;
  try {
    data = (await request.json()) as DevisPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Requête invalide." },
      { status: 400 },
    );
  }

  if (!data.prenom || !data.nom || !data.email || !isValidEmail(data.email)) {
    return NextResponse.json(
      { ok: false, error: "Champs obligatoires manquants ou email invalide." },
      { status: 422 },
    );
  }

  const [spas, config, settings, existing] = await Promise.all([
    getAllSpas(),
    getDevisConfig(),
    getSettings(),
    getAllDevisRequests(),
  ]);

  // Résolution du produit : slug, sinon libellé « Nom N places ».
  // Pas de repli : si rien ne correspond, la demande est GÉNÉRIQUE.
  const product =
    (data.slug && spas.find((s) => s.slug === data.slug)) ||
    (data.modele &&
      spas.find(
        (s) =>
          `${s.name} ${s.places} places`.toLowerCase() ===
            data.modele!.toLowerCase() ||
          data.modele!.toLowerCase().includes(s.name.toLowerCase()),
      )) ||
    undefined;

  const now = new Date();
  const dateLabel = now.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const id = `req-${now.getTime()}-${Math.round(Math.random() * 1000)}`;

  if (!product) {
    // Demande générique : e-mail de cadrage, envoyé à J+genericDelay.
    const built = buildInfoEmail({
      prenom: data.prenom,
      nom: data.nom,
      email: data.email,
      config,
      settings,
      ref: "",
      dateLabel,
    });
    const sendAt = new Date(
      now.getTime() + config.genericDelayMinutes * 60_000,
    ).toISOString();
    await addDevisRequest({
      id,
      type: "info",
      prenom: data.prenom,
      nom: data.nom,
      email: data.email,
      modeleLabel: "Demande d'informations",
      total: 0,
      ref: "",
      subject: built.subject,
      html: built.html,
      createdAt: now.toISOString(),
      sendAt,
      status: "pending",
    });
    console.info("[devis] demande générique mise en file :", {
      nom: `${data.prenom} ${data.nom}`,
      sendAt,
    });
    return NextResponse.json({ ok: true });
  }

  // Numérotation : DV-003520, démarrant à 3520. On prend le plus grand numéro
  // existant (robuste même après suppression) puis +1.
  const START = 3520;
  const nums = existing
    .map((r) => /^DV-(\d+)$/.exec(r.ref)?.[1])
    .filter((s): s is string => Boolean(s))
    .map((s) => parseInt(s, 10));
  const nextNum = Math.max(START - 1, ...nums) + 1;
  const ref = `DV-${String(nextNum).padStart(6, "0")}`;

  const built = buildDevis({
    prenom: data.prenom,
    nom: data.nom,
    email: data.email,
    product,
    config,
    settings,
    ref,
    dateLabel,
  });

  const sendAt = new Date(
    now.getTime() + config.delayMinutes * 60_000,
  ).toISOString();

  await addDevisRequest({
    id,
    type: "devis",
    prenom: data.prenom,
    nom: data.nom,
    email: data.email,
    modeleLabel: built.modeleLabel,
    total: built.total,
    ref,
    subject: built.subject,
    html: built.html,
    createdAt: now.toISOString(),
    sendAt,
    status: "pending",
  });

  console.info("[devis] devis mis en file :", {
    ref,
    nom: `${data.prenom} ${data.nom}`,
    modele: built.modeleLabel,
    sendAt,
  });

  // TODO email — l'envoi réel est déclenché par /api/cron/devis à l'échéance.

  return NextResponse.json({ ok: true });
}
