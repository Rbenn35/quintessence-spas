import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/Container";
import { Eyebrow, SectionHeading } from "@/components/SectionHeading";
import { RevendeurForm } from "@/components/RevendeurForm";
import { JsonLd } from "@/components/JsonLd";
import { getAllSpas } from "@/lib/store";
import { site } from "@/lib/site";
import { breadcrumbSchema, orgRef } from "@/lib/seo";

export const revalidate = 600;

export const metadata: Metadata = {
  // Le titre du site ajoute déjà « · Quintessence Spas » via le template.
  title: "Devenir revendeur de spas rigides, fournisseur en France",
  description:
    "Quintessence Spas, fournisseur et grossiste de spas rigides premium en France. Pisciniste, paysagiste ou distributeur : marges 25 à 40 %, stock en France, livraison et accompagnement complet. Réponse sous 48 h.",
  keywords: [
    "fournisseur de spas",
    "fournisseur spa rigide",
    "grossiste spa",
    "distributeur spa France",
    "devenir revendeur spa",
    "revendeur spa rigide",
    "tarifs professionnels spa",
    "spa pour pisciniste",
    "spa pour paysagiste",
  ],
  alternates: { canonical: "/revendeur" },
  openGraph: {
    title: "Devenir revendeur de spas rigides · Quintessence Spas",
    description:
      "Fournisseur français de spas rigides premium pour revendeurs, piscinistes et paysagistes. Marges attractives, stock France, accompagnement.",
    url: `${site.url}/revendeur`,
  },
};

const HERO_IMG = "/products/lucerne-installe.jpg";

const cibles = [
  "Piscinistes",
  "Paysagistes",
  "Revendeurs de spas",
  "Magasins bien-être",
  "Constructeurs",
];

const etapes = [
  [
    "Vous candidatez",
    "Remplissez le formulaire en ligne avec votre société, votre activité et votre projet. Aucun engagement à ce stade.",
  ],
  [
    "Nous étudions ensemble",
    "Réponse sous 48 h ouvrées : nous échangeons sur vos besoins et vous transmettons nos conditions et tarifs professionnels.",
  ],
  [
    "Vous démarrez la revente",
    "Formation produit, supports marketing et premier stock : vous vendez nos spas rigides en toute confiance.",
  ],
];

const faqRevendeur = [
  {
    q: "Comment devenir revendeur de spas Quintessence ?",
    a: "Remplissez le formulaire de candidature en ligne en précisant votre société, votre activité et votre projet. Nous répondons à chaque demande sous 48 heures ouvrées pour étudier ensemble un partenariat de distribution et vous communiquer nos tarifs professionnels.",
  },
  {
    q: "Quelle marge un revendeur réalise-t-il sur un spa rigide ?",
    a: "Les marges de revente sur un spa rigide premium se situent généralement entre 25 et 40 % selon le modèle, le volume commandé et votre positionnement. Nos conditions grossistes sont construites pour préserver votre rentabilité.",
  },
  {
    q: "Faut-il déjà vendre des spas pour devenir revendeur ?",
    a: "Non. Nous travaillons avec des piscinistes, des paysagistes, des magasins bien-être et des acteurs de l'hôtellerie de plein air qui ajoutent le spa rigide à leur offre. Notre formation produit vous permet de démarrer même sans expérience préalable du spa.",
  },
  {
    q: "Les spas sont-ils en stock et livrés en France ?",
    a: "Oui. Nous maintenons un stock en France et assurons la livraison 35 tonnes partout sur le territoire (hayon et transpalette). La disponibilité réduit vos délais et sécurise vos ventes.",
  },
  {
    q: "Quel accompagnement pour un nouveau distributeur ?",
    a: "Formation produit, support technique, conseil commercial, catalogues, visuels et fiches techniques prêts à l'emploi pour votre site et votre point de vente. Nous restons disponibles après le démarrage, SAV et garantie compris.",
  },
];

const avantages = [
  [
    "Marges attractives",
    "Conditions pro claires et remises par volume, pensées pour votre rentabilité.",
  ],
  [
    "Gamme premium différenciante",
    "Des spas rigides haut de gamme, fiables, qui valorisent votre showroom.",
  ],
  [
    "Stock & livraison France",
    "Disponibilité maîtrisée, livraison 35T partout en France (hayon + transpalette).",
  ],
  [
    "Accompagnement & formation",
    "Formation produit, support technique et conseil commercial pour démarrer vite.",
  ],
  [
    "Supports marketing",
    "Catalogues, visuels et fiches techniques prêts pour votre site et votre point de vente.",
  ],
  [
    "SAV & garantie",
    "Garantie constructeur et SAV réactif : vous vendez en confiance.",
  ],
];

export default async function RevendeurPage() {
  const gallery = (await getAllSpas())
    .map((s) => ({ src: s.photos?.[0], name: s.name }))
    .filter((g): g is { src: string; name: string } => Boolean(g.src))
    .slice(0, 6);

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Programme revendeur de spas rigides Quintessence",
    serviceType: "Distribution et fourniture de spas rigides premium",
    provider: orgRef,
    areaServed: { "@type": "Country", name: "France" },
    audience: {
      "@type": "BusinessAudience",
      name: "Revendeurs, piscinistes, paysagistes, hôtellerie de plein air",
    },
    description:
      "Quintessence Spas fournit des spas rigides premium aux professionnels en France : marges attractives, stock et livraison France, formation et accompagnement complet.",
    url: `${site.url}/revendeur`,
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqRevendeur.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const breadcrumbJsonLd = breadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Devenir revendeur", url: "/revendeur" },
  ]);

  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* HERO PLEIN ÉCRAN */}
      <section className="relative flex min-h-[600px] items-center py-24 text-center text-white">
        <Image
          src={HERO_IMG}
          alt="Spa rigide Quintessence installé sur une terrasse"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(15,41,50,.55) 0%, rgba(15,41,50,.78) 100%)",
          }}
        />
        <div className="relative z-10 w-full">
          <Container>
            <Image
              src="/brand/logo-hero-white.png"
              alt="Quintessence Spas"
              width={220}
              height={58}
              className="mx-auto h-10 w-auto"
            />
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Programme revendeurs · B2B
            </p>
            <h1 className="mx-auto mt-4 max-w-4xl text-4xl leading-[1.1] text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.45)] sm:text-6xl">
              Distribuez des spas premium qui font la différence
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90">
              Devenez revendeur Quintessence Spas : une gamme rigide haut de
              gamme, des marges attractives et un partenaire fiable, de la
              commande au SAV.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3.5">
              <a
                href="#candidature"
                className="inline-flex items-center justify-center rounded-full bg-white px-9 py-4 text-base font-semibold text-terra transition-colors hover:bg-cream"
              >
                Devenir revendeur
              </a>
              <a
                href="#candidature"
                className="inline-flex items-center justify-center rounded-full border-[1.5px] border-white/80 px-9 py-4 text-base font-medium text-white transition-colors hover:bg-white hover:text-terra"
              >
                Demander nos tarifs pro
              </a>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-2.5">
              {cibles.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-white/40 px-4 py-2 text-sm"
                >
                  {c}
                </span>
              ))}
            </div>
          </Container>
        </div>
      </section>

      {/* INTRODUCTION ÉDITORIALE (SEO) */}
      <Container>
        <section className="py-20">
          <div className="mx-auto max-w-3xl">
            <Eyebrow>Votre fournisseur de spas</Eyebrow>
            <h2 className="mt-3 text-3xl sm:text-4xl">
              Quintessence Spas, fournisseur de spas rigides premium en France
            </h2>
            <div className="mt-6 space-y-4 text-muted">
              <p>
                Vous cherchez un nouveau fournisseur de spas pour développer
                votre activité ? Quintessence Spas est un grossiste et
                distributeur français de spas rigides haut de gamme, dédié aux
                professionnels : revendeurs de spas, piscinistes, paysagistes,
                magasins bien-être et acteurs de l'hôtellerie de plein air.
              </p>
              <p>
                Nous proposons une gamme complète de spas rigides, de 2 à 8
                places, sélectionnés pour leur qualité de fabrication, leur
                confort et leur performance énergétique. Avec des tarifs
                professionnels clairs, des marges comprises entre 25 et 40 % et
                un stock disponible en France, vous bénéficiez d'un partenaire
                fiable, de la commande au service après-vente.
              </p>
              <p>
                Que vous souhaitiez ajouter le spa à votre offre existante ou
                ouvrir un nouveau rayon dans votre showroom, notre équipe vous
                accompagne à chaque étape : formation produit, supports
                marketing, conseil commercial et livraison partout en France.
                Découvrez aussi notre{" "}
                <Link href="/spas" className="text-terra underline">
                  catalogue de spas rigides
                </Link>{" "}
                et nos{" "}
                <Link href="/faq" className="text-terra underline">
                  questions fréquentes revendeurs
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </Container>

      {/* AVANTAGES */}
      <Container>
        <section className="pb-20">
          <SectionHeading
            eyebrow="Pourquoi nous rejoindre"
            title={
              <>
                Un partenariat <em className="italic text-terra">gagnant</em>
              </>
            }
            intro="Un partenariat pensé pour votre rentabilité et votre image."
          />
          <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {avantages.map(([titre, texte], i) => (
              <div key={titre}>
                <div className="font-serif text-3xl text-terra">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-2 text-xl">{titre}</h3>
                <p className="mt-2 text-sm text-muted">{texte}</p>
              </div>
            ))}
          </div>
        </section>
      </Container>

      {/* GAMME / PHOTOS */}
      {gallery.length > 0 && (
        <div className="border-y border-line bg-cream">
          <Container>
            <section className="py-20">
              <h2 className="text-center text-3xl sm:text-4xl">
                Une gamme complète, de 2 à 8 places
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-center text-muted">
                Des modèles différenciants qui valorisent votre showroom.
              </p>
              <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {gallery.map((g) => (
                  <div
                    key={g.src}
                    className="relative aspect-[3/4] overflow-hidden rounded-xl bg-line"
                  >
                    <Image
                      src={g.src}
                      alt={`Spa ${g.name} de Quintessence Spas`}
                      fill
                      sizes="(max-width: 768px) 50vw, 16vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-10 text-center">
                <Link
                  href="/spas"
                  className="inline-flex items-center justify-center rounded-full border-[1.5px] border-ink px-7 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-cream"
                >
                  Voir tout le catalogue
                </Link>
              </div>
            </section>
          </Container>
        </div>
      )}

      {/* COMMENT DEVENIR REVENDEUR */}
      <Container>
        <section className="py-20">
          <SectionHeading
            eyebrow="Comment ça marche"
            title={
              <>
                Devenir revendeur en{" "}
                <em className="italic text-terra">3 étapes</em>
              </>
            }
            intro="Un parcours simple et sans engagement pour démarrer la distribution."
          />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {etapes.map(([titre, texte], i) => (
              <div key={titre} className="rounded-2xl border border-line bg-card p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-terra font-serif text-lg text-white">
                  {i + 1}
                </div>
                <h3 className="mt-4 text-xl">{titre}</h3>
                <p className="mt-2 text-sm text-muted">{texte}</p>
              </div>
            ))}
          </div>
        </section>
      </Container>

      {/* FAQ REVENDEUR */}
      <div className="border-y border-line bg-cream">
        <Container>
          <section className="py-20">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-center text-3xl sm:text-4xl">
                Questions fréquentes des revendeurs
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-center text-muted">
                Tout ce qu'un futur distributeur de spas souhaite savoir avant
                de se lancer.
              </p>
              <div className="mt-10 divide-y divide-line rounded-2xl border border-line bg-card">
                {faqRevendeur.map((item) => (
                  <details key={item.q} className="group p-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium marker:hidden">
                      {item.q}
                      <span className="text-2xl leading-none text-terra transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-muted">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </Container>
      </div>

      {/* FORMULAIRE (section sombre) */}
      <section id="candidature" className="scroll-mt-20 bg-footer py-20 text-white">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow className="text-gold">Candidature</Eyebrow>
            <h2 className="mt-3 text-4xl text-white sm:text-5xl">
              Rejoignez le réseau
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">
              Réponse sous 48 h ouvrées avec nos conditions et tarifs
              professionnels.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-2xl rounded-3xl bg-white p-8 text-ink shadow-2xl sm:p-10">
            <RevendeurForm />
          </div>
        </Container>
      </section>
    </>
  );
}
