import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Container } from "@/components/Container";
import { getSettings } from "@/lib/store";

export async function Footer() {
  const settings = await getSettings();
  const columns = [
    {
      title: "Les spas",
      links: [
        { label: "Catalogue", href: "/spas" },
        { label: "Vassania 4 places", href: "/spas/vassania-4" },
        { label: "Gamme AquaLuxe", href: "/spas?gamme=AquaLuxe" },
        { label: "Demander un devis", href: "/devis" },
      ],
    },
    {
      title: "Découvrir",
      links: [
        { label: "La marque", href: "/marque" },
        { label: "Guide d'achat", href: "/guides/guide-achat-spa-rigide" },
        { label: "Rigide vs gonflable", href: "/guides/spa-rigide-vs-gonflable" },
        {
          label: "Installation & entretien",
          href: "/guides/installation-entretien-spa",
        },
      ],
    },
    {
      title: "Contact",
      links: [
        { label: settings.email, href: `mailto:${settings.email}` },
        { label: "Demander un devis", href: "/devis" },
      ],
    },
  ];

  return (
    <footer className="bg-footer text-[13px] text-[#9fb4bd]">
      <Container className="py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo light />
            <p className="mt-4 max-w-xs">
              Spas rigides chaleureux, conçus et installés par des experts
              passionnés depuis plus de 15 ans.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white">
                {col.title}
              </h4>
              {col.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block py-1 transition-colors hover:text-[#cfe0e6]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-[#21424d] pt-6 text-xs opacity-75">
          © {new Date().getFullYear()} {settings.name} · Tous droits réservés ·{" "}
          <Link href="/mentions-legales" className="hover:text-[#cfe0e6]">
            Mentions légales
          </Link>{" "}
          ·{" "}
          <Link href="/cgv" className="hover:text-[#cfe0e6]">
            CGV
          </Link>
        </div>
      </Container>
    </footer>
  );
}
