"use client";

import { usePathname } from "next/navigation";

/**
 * Affiche l'en-tête et le pied de page du site public, sauf sur le back-office
 * (/admin) qui possède sa propre interface (barre latérale).
 */
export function SiteChrome({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }
  return (
    <>
      {header}
      <main className="flex-1">{children}</main>
      {footer}
    </>
  );
}
