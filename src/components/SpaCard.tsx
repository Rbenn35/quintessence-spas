import Link from "next/link";
import Image from "next/image";
import type { Spa } from "@/lib/spas";
import {
  formatEuro,
  prixApresRemise,
  remiseEffectivePct,
  badgePersonnalise,
} from "@/lib/spas";
import type { Rating } from "@/lib/reviews";
import { Placeholder } from "@/components/Placeholder";
import { TrustStars } from "@/components/TrustStars";
import { PlugIcon } from "@/components/PlugIcon";

export function SpaCard({ spa, rating }: { spa: Spa; rating?: Rating }) {
  const prixFinal = prixApresRemise(spa);
  const remise = remiseEffectivePct(spa);
  const badge = badgePersonnalise(spa);

  return (
    <article className="group overflow-hidden rounded-[22px] border border-line bg-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_44px_rgba(59,47,39,0.12)]">
      <Link
        href={`/spas/${spa.slug}`}
        aria-label={`Découvrir le ${spa.name}`}
        className="relative block"
      >
        {badge && (
          <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-terra px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm">
            <PlugIcon className="h-3.5 w-3.5 shrink-0" />
            {badge}
          </span>
        )}
        {spa.photos?.[0] ? (
          <div className="relative aspect-square w-full">
            <Image
              src={spa.photos[0]}
              alt={`Spa ${spa.name} de Quintessence Spas`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
        ) : (
          <Placeholder
            from={spa.placeholder[0]}
            to={spa.placeholder[1]}
            rounded="rounded-none"
            className="aspect-square w-full"
            label={`${spa.name} · photo à venir`}
          />
        )}
      </Link>
      <div className="p-7">
        <h3 className="text-[1.7rem]">
          <Link href={`/spas/${spa.slug}`} className="hover:text-terra">
            {spa.name}
          </Link>
        </h3>
        <div className="mt-1 text-sm text-muted">
          {spa.dimensions.largeur} × {spa.dimensions.profondeur} ×{" "}
          {spa.dimensions.hauteur} cm
        </div>
        <div className="mt-1.5 text-[11.5px] font-semibold uppercase tracking-wider text-olive">
          {spa.places} places · {spa.jets} jets
        </div>
        {rating && rating.count > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <TrustStars rating={rating.avg} size="sm" />
            <span className="text-xs text-muted">{rating.count} avis</span>
          </div>
        )}
        <p className="mt-3 text-sm text-muted">{spa.accroche}</p>

        <div className="mt-5 flex items-center justify-between border-t border-line pt-5 text-[13px]">
          <span className="text-muted">
            {prixFinal !== null ? (
              <span className="inline-flex items-baseline gap-1.5">
                {remise !== null && spa.prixIndicatif !== null ? (
                  <span className="text-xs text-muted line-through">
                    {formatEuro(spa.prixIndicatif)}
                  </span>
                ) : null}
                <span className="font-semibold text-ink">
                  {formatEuro(prixFinal)}
                </span>
              </span>
            ) : (
              <span className="font-semibold text-ink">Sur devis</span>
            )}
          </span>
          <Link href={`/spas/${spa.slug}`} className="font-semibold text-terra">
            Découvrir →
          </Link>
        </div>
      </div>
    </article>
  );
}
