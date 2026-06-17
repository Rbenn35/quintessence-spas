/* eslint-disable @next/next/no-img-element */
import type { DevisDocData } from "@/lib/devis-document";
import type { DevisAddress } from "@/lib/devis-requests";

/**
 * Document de devis (design « Template A » : type facture A4).
 * En-tête légal, photo + caractéristiques, lignes détaillées, total.
 * `children` est rendu dans la carte après le total (formulaire/signature
 * pour la page de validation, ou coordonnées + tampon signé pour la page
 * validée).
 */
export function DevisDocument({
  devisRef,
  dateLabel,
  clientName,
  clientEmail,
  data,
  billing,
  delivery,
  children,
}: {
  devisRef: string;
  dateLabel: string;
  clientName: string;
  clientEmail: string;
  data: DevisDocData;
  billing?: DevisAddress;
  delivery?: DevisAddress;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl rounded-2xl bg-white p-7 shadow-[0_10px_40px_rgba(19,49,61,0.08)] print:rounded-none print:shadow-none sm:p-12">
      {/* En-tête : logo + mentions légales / réf */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-5">
        <div>
          <img src="/brand/logo.png" alt="Quintessence Spas" className="h-10" />
          <div className="mt-3 text-xs leading-relaxed text-muted">
            <span className="font-semibold text-ink">Quintessence Spas</span>
            <br />
            14 Avenue des Vignes, 17320 Saint-Just-Luzac
            <br />
            contact@quintessencespas.com
          </div>
        </div>
        <div className="shrink-0 text-right text-sm">
          <div className="font-semibold">Devis {devisRef}</div>
          <div className="text-muted">{dateLabel}</div>
          <div className="mt-1 text-muted">Validité {data.validityDays} jours</div>
        </div>
      </div>

      {/* Client (avec facturation / livraison) */}
      <div className="mt-5 text-sm">
        <span className="text-xs uppercase tracking-wide text-muted">Client</span>
        <div className="font-medium">{clientName}</div>
        {billing && (
          <div className="text-muted">
            {billing.address}, {billing.cp} {billing.city}
            {billing.phone ? ` · Tél. ${billing.phone}` : ""}
          </div>
        )}
        <div className="text-muted">{clientEmail}</div>
        {delivery && (
          <div className="mt-1 text-muted">
            <span className="text-xs uppercase tracking-wide">Livraison : </span>
            {delivery.address}, {delivery.cp} {delivery.city}
          </div>
        )}
      </div>

      {/* Photo + caractéristiques */}
      <div className="mt-6 grid gap-5 sm:grid-cols-[1fr_1.2fr]">
        {data.photo ? (
          <img
            src={data.photo}
            alt={data.spaName}
            className="h-44 w-full rounded-2xl object-cover sm:h-full"
          />
        ) : (
          <div className="h-44 w-full rounded-2xl bg-cream sm:h-full" />
        )}
        <div>
          <h3 className="text-lg">{data.spaName}</h3>
          <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
            {data.specs.map(([k, v]) => (
              <div key={k} className="flex flex-col">
                <span className="text-xs uppercase tracking-wide text-muted">
                  {k}
                </span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Détail de l'offre */}
      <h4 className="mt-7 text-xs font-semibold uppercase tracking-wide text-muted">
        Détail de l'offre
      </h4>
      <div className="mt-1 divide-y divide-line">
        {data.lines.map((l) => (
          <div
            key={l.label}
            className="flex items-start justify-between gap-4 py-3"
          >
            <div className="min-w-0">
              <div className="font-medium">{l.label}</div>
              {l.desc && (
                <div className="mt-0.5 text-xs leading-relaxed text-muted">
                  {l.desc}
                </div>
              )}
            </div>
            <div
              className={`shrink-0 text-right text-sm ${
                l.offered ? "font-semibold text-[#00917f]" : "font-medium"
              }`}
            >
              {l.old && (
                <div className="text-xs text-muted line-through">{l.old}</div>
              )}
              {l.price}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between border-t-2 border-ink pt-3 text-lg font-semibold">
        <span>Total TTC</span>
        <span>{data.total}</span>
      </div>
      <p className="mt-1 text-right text-sm text-[#00917f]">
        Économie de {data.economie}
      </p>

      {children}
    </div>
  );
}
