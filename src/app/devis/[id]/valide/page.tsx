/* eslint-disable @next/next/no-img-element */
import { notFound } from "next/navigation";
import {
  getDevisRequest,
  getAllSpas,
  getDevisConfig,
  getSettings,
} from "@/lib/store";
import { buildDevisDocData } from "@/lib/devis-document";
import { DevisDocument } from "@/components/DevisDocument";
import { formatPrenom, formatNom } from "@/lib/format";
import { PrintButton } from "./PrintButton";

export const dynamic = "force-dynamic";

function fmtDate(iso?: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default async function ValideDevisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const req = await getDevisRequest(id);
  if (!req || req.type !== "devis") notFound();

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
    <div className="devis-print min-h-screen bg-bg py-10 print:py-8">
      <PrintButton />
      <div className="mx-auto max-w-3xl px-4 print:px-6">
        <DevisDocument
          devisRef={req.ref}
          dateLabel={fmtDate(req.createdAt)}
          clientName={`${formatPrenom(req.prenom)} ${formatNom(req.nom)}`}
          clientEmail={req.email}
          data={data}
          billing={req.billing}
          delivery={req.delivery}
        >
          {/* Tampon de signature */}
          {req.signed ? (
            <div className="mt-8 break-inside-avoid rounded-xl border border-[#00917f]/30 bg-[#00917f]/5 p-5">
              <div className="flex items-center gap-2 font-semibold text-[#00917f]">
                ✓ Devis validé et signé
              </div>
              <div className="mt-1 text-sm text-muted">
                Signé par <b className="text-ink">{req.signerName}</b> le{" "}
                {fmtDate(req.signedAt)}
                {req.signerIp ? ` · IP ${req.signerIp}` : ""}
              </div>
              {req.signatureDataUrl && (
                <img
                  src={req.signatureDataUrl}
                  alt="Signature"
                  className="mt-3 h-20 rounded-lg border border-line bg-white"
                />
              )}
            </div>
          ) : (
            <p className="mt-6 text-sm text-muted">
              Ce devis n&apos;a pas encore été signé.
            </p>
          )}
        </DevisDocument>
      </div>
    </div>
  );
}
