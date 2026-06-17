import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/Container";
import { Eyebrow, SectionHeading } from "@/components/SectionHeading";
import { RevendeurForm } from "@/components/RevendeurForm";
import { getAllSpas } from "@/lib/store";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

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

const HERO_IMG = "/products/lucerne-installe.jpg";

const cibles = [
  "Piscinistes",
  "Paysagistes",
  "Revendeurs de spas",
  "Magasins bien-être",
  "Constructeurs",
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

  return (
    <>
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

      {/* AVANTAGES */}
      <Container>
        <section className="py-20">
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
