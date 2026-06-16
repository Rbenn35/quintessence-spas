import Link from "next/link";
import { clsx } from "@/lib/clsx";

type Variant = "primary" | "ghost" | "light";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center rounded-full font-medium tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2";

const sizes: Record<Size, string> = {
  md: "px-7 py-3.5 text-sm",
  lg: "px-9 py-4 text-base",
};

const variants: Record<Variant, string> = {
  primary: "bg-terra text-white hover:bg-terra-dark",
  ghost: "border-[1.5px] border-ink text-ink hover:bg-ink hover:text-cream",
  light: "bg-white text-terra hover:bg-cream",
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={clsx(base, sizes[size], variants[variant], className)}
    >
      {children}
    </Link>
  );
}
