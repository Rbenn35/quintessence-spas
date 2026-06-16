import { clsx } from "@/lib/clsx";

/**
 * Bloc image placeholder (dégradé) en attendant les vraies photos.
 * À remplacer par <Image> de next/image une fois les visuels fournis.
 */
export function Placeholder({
  from,
  to,
  label,
  className,
  rounded = "rounded-2xl",
}: {
  from: string;
  to: string;
  label?: string;
  className?: string;
  rounded?: string;
}) {
  return (
    <div
      className={clsx("relative overflow-hidden", rounded, className)}
      style={{ background: `linear-gradient(165deg, ${from}, ${to})` }}
      role="img"
      aria-label={label ?? "Photographie à venir"}
    >
      {label && (
        <span className="absolute bottom-4 left-5 max-w-[80%] text-[11px] uppercase tracking-wider text-white/90">
          {label}
        </span>
      )}
    </div>
  );
}
