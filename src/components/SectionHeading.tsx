import { clsx } from "@/lib/clsx";

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "text-xs font-semibold uppercase tracking-[0.2em] text-olive",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  centered = true,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  centered?: boolean;
}) {
  return (
    <div
      className={clsx(
        "max-w-2xl",
        centered && "mx-auto text-center",
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-3 text-4xl sm:text-[2.85rem]">{title}</h2>
      {intro && <p className="mt-4 text-muted">{intro}</p>}
    </div>
  );
}
