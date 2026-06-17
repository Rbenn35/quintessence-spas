import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Eyebrow, SectionHeading } from "@/components/SectionHeading";
import { RevendeurForm } from "@/components/RevendeurForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Devenir revendeur de spas | Quintessence Spas",
  description:
    "Pisciniste, paysagiste ou revendeur : distribuez les spas rigides premium Quintessence. Marges attractives, stock en France, accompagnement complet. Candidature en ligne.",
  alternates: { canonical: "/revendeur" },
  openGraph: {
    title: "Devenir revendeur — Quintessence Spas",
    description:
      "Distribuez une gamme de spas rigides premium. Marges, stock France, accompagnement.",
    url: `${site.url}/revendeur`,
  },
};

const avantages = [
  {
    titre: "Marges attractives",
    texte:
      "Des conditions professionnelles claires et des remises par volume, pensées pour votre rentabilité.",
  },
  {
    titre: "Gamme premium prête à vendre",
    texte:
      "Des spas rigides haut de gamme, fiables et différenciants, avec fiches techniques et visuels fournis.",
  },
  {
    titre: "Stock & livraison en France",
    texte:
      "Disponibilité maîtrisée et livraison partout en France (camion 35T, hayon et transpalette).",
  },
  {
    titre: "Accompagnement & formation",
    texte:
      "Formation produit, support technique et conseil commercial pour démarrer vite et bien.",
  },
  {
    titre: "Supports marketing",
    texte:
      "Catalogues, visuels, fiches techniques et argumentaires pour équiper votre showroom et votre site.",
  },
  {
    titre: "SAV & garantie",
    texte:
      "Garantie constructeur et SAV réactif : vous vendez en confiance, on assure le suivi.",
  },
];

const cibles = [
  "Piscinistes",
  "Paysagistes",
  "Revendeurs de spas",
  "Magasins spa & bien-être",
  "Constructeurs & promoteurs",
];

export default function RevendeurPage() {
  return (
    <>
      {/* HERO */}
      <Container>
        <section className="py-14 text-center sm:py-20">
          <Eyebrow>Programme revendeurs · B2B</Eyebrow>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl leading-[1.1] sm:text-6xl">
            Devenez revendeur de{" "}
            <em className="italic text-terra">spas premium</em>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            Quintessence Spas est votre <strong>fournisseur de spas rigides
            haut de gamme</strong>. Piscinistes, paysagistes, revendeurs :
            enrichissez votre offre avec une gamme différenciante et un partenaire
            fiable, de la commande au SAV.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3.5">
            <a
              href="#candidature"
              className="inline-flex items-center justify-center rounded-full bg-terra px-9 py-4 text-base font-medium text-white transition-colors hover:bg-terra-dark"
            >
              Devenir revendeur
            </a>
            <Link
              href="/spas"
              className="inline-flex items-center justify-center rounded-full border-[1.5px] border-ink px-9 py-4 text-base font-medium text-ink transition-colors hover:bg-ink hover:text-cream"
            >
              Voir la gamme
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {cibles.map((c) => (
              <span
                key={c}
                className="rounded-full border border-line bg-card px-4 py-2 text-sm text-muted"
              >
                {c}
              </span>
            ))}
          </div>
        </section>
      </Container>

      {/* AVANTAGES */}
      <div className="border-y border-line bg-cream">
        <Container>
          <section className="py-20">
            <SectionHeading
              eyebrow="Pourquoi nous rejoindre"
              title={
                <>
                  Un partenariat <em className="italic text-terra">gagnant</em>
                </>
              }
              intro="Tout ce qu'il faut pour vendre des spas premium sereinement et avec marge."
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {avantages.map((a) => (
                <div
                  key={a.titre}
                  className="rounded-2xl border border-line bg-card p-7"
                >
                  <h3 className="text-xl">{a.titre}</h3>
                  <p className="mt-2 text-sm text-muted">{a.texte}</p>
                </div>
              ))}
            </div>
          </section>
        </Container>
      </div>

      {/* FORMULAIRE */}
      <Container>
        <section id="candidature" className="scroll-mt-24 py-20">
          <div className="mx-auto max-w-2xl">
            <SectionHeading
              eyebrow="Candidature"
              title={
                <>
                  Rejoignez le <em className="italic text-terra">réseau</em>
                </>
              }
              intro="Remplissez ce formulaire : notre équipe revendeurs revient vers vous sous 48 h ouvrées avec nos conditions et tarifs professionnels."
            />
            <div className="mt-10">
              <RevendeurForm />
            </div>
          </div>
        </section>
      </Container>
    </>
  );
}
