import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/SectionHeading";
import { Button } from "@/components/Button";
import { getSettings } from "@/lib/store";
import { ContactForm } from "./ContactForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez Quintessence Spas par email. Une question, un projet ? Nos conseillers vous répondent. Vente 100 % en ligne, livraison partout en France.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const site = await getSettings();
  return (
    <Container>
      <section className="py-14 sm:py-20">
        <Eyebrow>Contact</Eyebrow>
        <h1 className="mt-3 max-w-2xl text-4xl sm:text-5xl">
          Parlons de votre projet
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted">
          Une question sur un modèle, un conseil ? Écrivez-nous via le
          formulaire ci-dessous, notre équipe vous répond rapidement.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          {/* Formulaire */}
          <div className="rounded-2xl border border-line bg-card p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl">Écrivez-nous</h2>
            <p className="mt-1 text-sm text-muted">
              Réponse sous 48&nbsp;h ouvrées.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          {/* Coordonnées + devis */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-line bg-card p-7">
              <h2 className="text-xl">Par email</h2>
              <a
                href={`mailto:${site.email}`}
                className="mt-2 block break-all text-lg font-medium text-terra"
              >
                {site.email}
              </a>
              <p className="mt-2 text-sm text-muted">
                Réponse sous 48&nbsp;h ouvrées
              </p>
            </div>

            <div className="rounded-2xl bg-cream p-7">
              <h2 className="text-xl">Un projet de spa ?</h2>
              <p className="mt-2 text-sm text-muted">
                Pour un prix personnalisé, le plus rapide reste la demande de
                devis gratuite.
              </p>
              <div className="mt-4">
                <Button href="/devis">Demander un devis gratuit</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}
