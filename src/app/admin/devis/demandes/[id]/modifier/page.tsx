import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import {
  getDevisRequest,
  getAllSpas,
  getDevisConfig,
} from "@/lib/store";
import { prixApresRemise } from "@/lib/spas";
import { DevisResendEditor } from "./DevisResendEditor";

export const dynamic = "force-dynamic";

export default async function ModifierDevisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { id } = await params;

  const [req, spas, config] = await Promise.all([
    getDevisRequest(id),
    getAllSpas(),
    getDevisConfig(),
  ]);

  if (!req) notFound();
  if (req.type !== "devis") {
    // Les demandes d'infos génériques ne sont pas des devis chiffrés.
    redirect("/admin/devis");
  }

  const product =
    (req.slug && spas.find((s) => s.slug === req.slug)) ||
    spas.find(
      (s) =>
        `${s.name} ${s.places} places`.toLowerCase() ===
          req.modeleLabel.toLowerCase() ||
        req.modeleLabel.toLowerCase().includes(s.name.toLowerCase()),
    );

  // Prix du spa après remise catalogue + remise devis supplémentaire.
  const prixSite = product ? (prixApresRemise(product) ?? 0) : 0;
  const extraPct = config.extraRemisePct ?? 0;
  const basePrice = Math.round(prixSite * (1 - extraPct / 100));

  // Lignes déjà incluses dans ce devis (ou snapshot des lignes actives).
  const currentLines = req.lines ?? config.lines.filter((l) => l.active);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link
        href="/admin/devis"
        className="text-sm text-muted hover:text-terra"
      >
        ← Retour aux devis
      </Link>
      <h1 className="mt-4 text-3xl">Modifier &amp; renvoyer le devis</h1>
      <p className="mt-1 text-sm text-muted">
        {req.ref} · {req.prenom} {req.nom} · {req.modeleLabel}
      </p>

      {!product ? (
        <div className="mt-8 rounded-2xl border border-terra/40 bg-terra/5 p-6 text-sm">
          Le modèle de spas de ce devis est introuvable dans le catalogue
          actuel : impossible de le régénérer automatiquement.
        </div>
      ) : (
        <DevisResendEditor
          requestId={req.id}
          clientName={`${req.prenom} ${req.nom}`}
          clientEmail={req.email}
          productName={`${product.name} ${product.places} places`}
          basePrice={basePrice}
          catalog={config.lines}
          currentLines={currentLines}
        />
      )}
    </div>
  );
}
