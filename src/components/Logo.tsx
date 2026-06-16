import Link from "next/link";
import Image from "next/image";

/** Symbole « Q » seul (réseaux sociaux, etc.). */
export function LogoMark({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <Image
      src="/brand/q-mark.png"
      alt="Quintessence Spas"
      width={512}
      height={512}
      className={className}
    />
  );
}

/**
 * Logo complet « Quintessence Spas » (version bleue, disposition empilée).
 * `light` sert pour les fonds sombres (footer).
 */
export function Logo({
  light = false,
  className = "h-16 w-auto",
}: {
  light?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="Quintessence Spas · accueil"
      className="inline-flex"
    >
      <Image
        src={light ? "/brand/logo-dark.png" : "/brand/logo.png"}
        alt="Quintessence Spas · spas rigides premium"
        width={1359}
        height={360}
        priority
        className={className}
      />
    </Link>
  );
}
