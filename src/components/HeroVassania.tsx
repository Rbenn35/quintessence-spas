import Image from "next/image";
import Link from "next/link";
import { clsx } from "@/lib/clsx";

/**
 * Visuel d'accueil mettant en avant le nouveau modèle Vassania 4 places.
 * Vraie photo d'ambiance (terrasse ensoleillée), non retouchée.
 */
export function HeroVassania({ className }: { className?: string }) {
  return (
    <Link
      href="/spas/vassania-4"
      aria-label="Découvrir le spa Vassania 4 places"
      className={clsx(
        "group relative block overflow-hidden rounded-[140px_140px_18px_18px]",
        className,
      )}
    >
      <Image
        src="/products/vassania-2.jpg"
        alt="Spa Vassania 4 places de Quintessence Spas installé sur une terrasse en bois ensoleillée"
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover"
      />

      {/* Badge « nouveau modèle » */}
      <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ink shadow-sm backdrop-blur">
        <span className="h-2 w-2 rounded-full bg-terra" />
        Nouveau · Vassania 4 places
      </span>

      {/* Libellé bas, apparait au survol */}
      <span className="absolute bottom-5 left-5 rounded-full bg-ink/70 px-4 py-2 text-xs font-medium text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
        Découvrir le modèle →
      </span>
    </Link>
  );
}
