import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/SectionHeading";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du site Quintessence Spas, marque de la société Quality Spa : éditeur, hébergeur, propriété intellectuelle et données personnelles.",
  alternates: { canonical: "/mentions-legales" },
  robots: { index: false, follow: true },
};

export default function MentionsLegalesPage() {
  return (
    <Container>
      <article className="py-14 sm:py-20">
        <nav aria-label="Fil d'Ariane" className="text-sm text-muted">
          <Link href="/" className="hover:text-terra">
            Accueil
          </Link>{" "}
          / <span className="text-ink">Mentions légales</span>
        </nav>

        <Eyebrow className="mt-6">Informations légales</Eyebrow>
        <h1 className="mt-3 text-4xl sm:text-5xl">Mentions légales</h1>

        <div className="mt-10 max-w-3xl space-y-10 text-muted">
          <section>
            <h2 className="text-2xl text-ink">Éditeur du site</h2>
            <p className="mt-3">
              Le site {site.name} ({site.url}) est édité par la société{" "}
              <strong className="text-ink">Quality Spa</strong>. Quintessence
              Spas est une marque détenue et exploitée par Quality Spa.
            </p>
            <ul className="mt-4 space-y-1.5">
              <li>Raison sociale : Quality Spa</li>
              <li>Forme juridique : société à responsabilité limitée (SARL)</li>
              <li>Siège social : 14 avenue des Vignes, 17320 Saint-Just-Luzac</li>
              <li>SIREN : 832 359 137</li>
              <li>SIRET (siège) : 832 359 137 00037</li>
              <li>RCS : La Rochelle 832 359 137</li>
              <li>TVA intracommunautaire : FR21 832 359 137</li>
              <li>
                Adresse e-mail :{" "}
                <a href={`mailto:${site.email}`} className="text-terra underline">
                  {site.email}
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-ink">Responsable de la publication</h2>
            <p className="mt-3">
              Benoît Rolle, en qualité de gérant de la société Quality Spa.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-ink">Hébergement</h2>
            <p className="mt-3">
              Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut,
              CA 91789, États-Unis. Site web :{" "}
              <a
                href="https://vercel.com"
                className="text-terra underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                vercel.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-ink">Propriété intellectuelle</h2>
            <p className="mt-3">
              L'ensemble des éléments de ce site (textes, photographies, logos,
              marques, mise en page et charte graphique) est protégé par le droit
              de la propriété intellectuelle et demeure la propriété exclusive de
              Quality Spa ou de ses partenaires. Toute reproduction,
              représentation, modification ou exploitation, totale ou partielle,
              sans autorisation écrite préalable, est interdite et susceptible de
              constituer une contrefaçon.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-ink">Données personnelles</h2>
            <p className="mt-3">
              Les informations recueillies via les formulaires du site (demande
              de devis, contact, candidature revendeur) sont utilisées
              uniquement pour traiter votre demande et assurer le suivi
              commercial. Elles ne sont pas cédées à des tiers à des fins
              commerciales. Conformément au Règlement général sur la protection
              des données (RGPD) et à la loi Informatique et Libertés, vous
              disposez d'un droit d'accès, de rectification et de suppression des
              données vous concernant. Pour l'exercer, écrivez à{" "}
              <a href={`mailto:${site.email}`} className="text-terra underline">
                {site.email}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-ink">Cookies</h2>
            <p className="mt-3">
              Ce site utilise uniquement les cookies techniques nécessaires à son
              bon fonctionnement. Aucun cookie publicitaire de suivi n'est déposé
              sans votre consentement.
            </p>
          </section>
        </div>
      </article>
    </Container>
  );
}
