import { notFound, redirect } from "next/navigation";
import {
  getDevisRequest,
  getAllSpas,
  getDevisConfig,
  getSettings,
} from "@/lib/store";
import { buildDevisDocData } from "@/lib/devis-document";
import { DevisDocument } from "@/components/DevisDocument";
import { formatPrenom, formatNom } from "@/lib/format";
import { DevisSignForm } from "./DevisSignForm";

export const dynamic = "force-dynamic";

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default async function SignerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const req = await getDevisRequest(id);
  if (!req || req.type !== "devis") notFound();
  // Déjà signé → on montre directement le devis validé.
  if (req.signed) redirect(`/devis/${id}/valide`);

  const [spas, config, settings] = await Promise.all([
    getAllSpas(),
    getDevisConfig(),
    getSettings(),
  ]);
  const spa =
    (req.slug && spas.find((s) => s.slug === req.slug)) ||
    spas.find(
      (s) =>
        `${s.name} ${s.places} places`.toLowerCase() ===
          req.modeleLabel.toLowerCase() ||
        req.modeleLabel.toLowerCase().includes(s.name.toLowerCase()),
    );
  if (!spa) notFound();

  const data = buildDevisDocData(req, spa, config, settings);

  return (
    <div className="min-h-screen bg-bg py-10 sm:py-14">
      <div className="mx-auto max-w-3xl px-4">
        <p className="mb-5 text-center text-sm text-muted">
          Vérifiez votre devis, complétez vos coordonnées et signez pour le
          valider.
        </p>
        <DevisDocument
          devisRef={req.ref}
          dateLabel={fmtDate(req.createdAt)}
          clientName={`${formatPrenom(req.prenom)} ${formatNom(req.nom)}`}
          clientEmail={req.email}
          data={data}
        >
          <DevisSignForm
            requestId={id}
            defaultName={`${formatPrenom(req.prenom)} ${formatNom(req.nom)}`}
          />
        </DevisDocument>
      </div>
    </div>
  );
}
