"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "@/lib/clsx";

type Item = { href: string; label: string; paths: string[] };

const ITEMS: Item[] = [
  {
    href: "/admin/fiches",
    label: "Fiches techniques",
    paths: [
      "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
      "M14 2v6h6",
      "M12 18v-6",
      "M9 15l3 3 3-3",
    ],
  },
  {
    href: "/admin/accessoires",
    label: "Accessoires",
    paths: [
      "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z",
      "M3 6h18",
      "M16 10a4 4 0 0 1-8 0",
    ],
  },
  {
    href: "/admin/articles",
    label: "Articles",
    paths: [
      "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
      "M14 2v6h6",
      "M16 13H8",
      "M16 17H8",
    ],
  },
  {
    href: "/admin/avis",
    label: "Avis",
    paths: [
      "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z",
    ],
  },
  {
    href: "/admin/devis",
    label: "Devis",
    paths: [
      "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
      "M14 2v6h6",
      "M9 15l2 2 4-4",
    ],
  },
  {
    href: "/admin/messages",
    label: "Messages",
    paths: [
      "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
      "M22 6l-10 7L2 6",
    ],
  },
  {
    href: "/admin/reglages",
    label: "Réglages",
    paths: [
      "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
      "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
    ],
  },
];

const PRODUITS: Item = {
  href: "/admin",
  label: "Produits",
  paths: [
    "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
    "M3.27 6.96 12 12.01l8.73-5.05",
    "M12 22.08V12",
  ],
};

function NavIcon({ paths }: { paths: string[] }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

export function AdminSidebar({
  unreadMessages = 0,
}: {
  unreadMessages?: number;
}) {
  const pathname = usePathname() ?? "";
  const router = useRouter();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);
  // Produits = /admin et toutes les pages produit (/admin/new, /admin/[slug]).
  const produitsActive = !ITEMS.some((i) => isActive(i.href));

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const link = (item: Item, active: boolean) => {
    const badge =
      item.href === "/admin/messages" && unreadMessages > 0
        ? unreadMessages
        : null;
    return (
      <Link
        key={item.href}
        href={item.href}
        className={clsx(
          "flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-colors",
          active
            ? "bg-terra/10 font-medium text-terra"
            : "text-ink hover:bg-cream",
        )}
      >
        <NavIcon paths={item.paths} />
        {item.label}
        {badge !== null && (
          <span
            className="ml-auto inline-flex min-w-[20px] items-center justify-center rounded-full bg-terra px-1.5 py-0.5 text-[11px] font-semibold leading-none text-white"
            aria-label={`${badge} message${badge > 1 ? "s" : ""} non lu${badge > 1 ? "s" : ""}`}
          >
            {badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside className="border-b border-line bg-cream/40 md:w-60 md:shrink-0 md:border-b-0 md:border-r">
      <div className="flex h-full flex-col md:sticky md:top-0 md:h-screen">
        <div className="px-5 py-5">
          <Link href="/admin" className="font-serif text-lg text-ink">
            Quintessence <span className="text-muted">Admin</span>
          </Link>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-2 md:flex-col md:overflow-visible">
          {link(PRODUITS, produitsActive)}
          {ITEMS.map((item) => link(item, isActive(item.href)))}
        </nav>

        <div className="mt-auto flex items-center justify-between gap-2 px-4 py-4 md:flex-col md:items-stretch md:gap-2">
          <Link
            href="/"
            target="_blank"
            className="rounded-xl px-3.5 py-2.5 text-sm text-muted transition-colors hover:bg-cream hover:text-ink"
          >
            Voir le site ↗
          </Link>
          <button
            type="button"
            onClick={logout}
            className="rounded-xl px-3.5 py-2.5 text-left text-sm text-muted transition-colors hover:bg-cream hover:text-terra-dark"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </aside>
  );
}
