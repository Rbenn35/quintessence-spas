import Link from "next/link";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { Eyebrow, SectionHeading } from "@/components/SectionHeading";
import { TrustBar } from "@/components/TrustBar";
import { SpaCard } from "@/components/SpaCard";
import { DevisCTA } from "@/components/DevisCTA";
import { RevendeurCTA } from "@/components/RevendeurCTA";
import Image from "next/image";
import { HeroVassania } from "@/components/HeroVassania";
import { getAllSpas, getAllReviews } from "@/lib/store";
import { statsForProduct } from "@/lib/reviews";

// ISR : page mise en cache au CDN, régénérée au plus toutes les 10 min.
// Les modifs admin déclenchent une revalidation immédiate (revalidatePath).
export const revalidate = 600;

const guides = [
  {
    eyebrow: "Guide",
    title: "Guide d'achat du spa rigide",
    intro: "Places, dimensions, budget, énergie : choisir sereinement.",
    href: "/guides/guide-achat-spa-rigide",
  },
  {
    eyebrow: "Comparatif",
    title: "Spa rigide vs gonflable",
    intro: "Durabilité, confort, coût réel sur la durée.",
    href: "/guides/spa-rigide-vs-gonflable",
  },
  {
    eyebrow: "Pratique",
    title: "Installation & entretien",
    intro: "Terrain, eau, hivernage : nos conseils d'installateurs.",
    href: "/guides/installation-entretien-spa",
  },
];

export default async function HomePage() {
  const phares = (await getAllSpas()).slice(0, 3);
  const reviews = await getAllReviews();

  return (
    <>
      {/* BANDEAU PRO (B2B) */}
      <div className="bg-footer text-white">
        <Container>
          <Link
            href="/revendeur"
            className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2.5 text-center text-sm"
          >
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gold">
              Professionnels
            </span>
            <span className="text-white/90">
              Pisciniste, paysagiste ou revendeur ? Distribuez nos spas premium.
            </span>
            <span className="font-semibold underline underline-offset-2">
              Devenir revendeur →
            </span>
          </Link>
        </Container>
      </div>

      {/* HERO */}
      <Container>
        <section className="grid items-center gap-10 py-12 sm:py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          <div>
            <Eyebrow>Bien-être · Fabriqué pour durer</Eyebrow>
            <h1 className="mt-4 text-5xl leading-[1.1] sm:text-6xl">
              Votre rituel bien-être,{" "}
              <em className="italic text-terra">à la maison.</em>
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted">
              Des spas rigides chaleureux, pensés pour le confort et la détente.
              Une eau parfaite, un massage enveloppant, des matériaux nobles :
              votre cocon, toute l'année.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Button href="/devis" size="lg">
                Demander un devis gratuit
              </Button>
              <Button href="/spas" variant="ghost" size="lg">
                Voir le catalogue
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted">
              Vous êtes professionnel ?{" "}
              <Link
                href="/revendeur"
                className="font-semibold text-terra underline-offset-2 hover:underline"
              >
                Devenez revendeur de spas →
              </Link>
            </p>
          </div>

          <HeroVassania className="h-80 w-full lg:h-[520px]" />
        </section>
      </Container>

      <TrustBar />

      {/* MODÈLES PHARES */}
      <Container>
        <section className="py-24">
          <SectionHeading
            eyebrow="Notre sélection"
            title={
              <>
                Nos modèles <em className="italic text-terra">phares</em>
              </>
            }
            intro="Une gamme resserrée de spas rigides, choisis pour leur confort et leur qualité de fabrication. De 2 à 8 places."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {phares.map((spa) => (
              <SpaCard
                key={spa.slug}
                spa={spa}
                rating={statsForProduct(reviews, spa.slug)}
              />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button href="/spas" variant="ghost">
              Voir tout le catalogue
            </Button>
          </div>
        </section>
      </Container>

      {/* POURQUOI QUINTESSENCE */}
      <div className="border-y border-line bg-cream">
        <Container>
          <section className="grid gap-12 py-24 lg:grid-cols-2 lg:items-center">
            <div className="relative h-72 w-full overflow-hidden rounded-2xl lg:h-96">
              <Image
                src="/products/lucerne-installe.jpg"
                alt="Spa rigide Quintessence installé sur une terrasse, livré et mis en service par nos équipes"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <Eyebrow>La signature Quintessence</Eyebrow>
              <h2 className="mt-3 text-4xl sm:text-[2.6rem]">
                Le luxe se vit dans les détails
              </h2>
              <p className="mt-4 text-muted">
                Depuis plus de 15 ans, nous sélectionnons des spas rigides parmi
                les plus aboutis du marché. Fabrication soignée, hydromassage
                pensé pour le corps, performance énergétique réelle : chaque
                modèle est choisi pour durer et vous accompagner au quotidien.
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {[
                  "Installation et mise en service par nos équipes",
                  "Garantie 5 ans et SAV réactif partout en France",
                  "Paiement 100 % sécurisé en ligne",
                  "Conseil personnalisé avant et après l'achat",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 text-terra">◆</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button href="/marque" variant="ghost">
                  Découvrir la marque
                </Button>
              </div>
            </div>
          </section>
        </Container>
      </div>

      {/* FOURNISSEUR B2B (SEO) */}
      <Container>
        <section className="py-20">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>Professionnels du spa</Eyebrow>
            <h2 className="mt-3 text-3xl sm:text-4xl">
              Un fournisseur de spas rigides pour les professionnels
            </h2>
            <p className="mt-5 text-muted">
              Vous êtes pisciniste, paysagiste ou revendeur et cherchez un
              fournisseur de spas fiable ? Quintessence Spas distribue ses spas
              rigides premium aux professionnels partout en France, avec des
              tarifs grossistes, un stock disponible et un accompagnement
              complet. Marges attractives, formation produit et livraison sur
              tout le territoire : développez votre activité avec une gamme qui
              valorise votre offre.
            </p>
            <div className="mt-7">
              <Button href="/revendeur" variant="ghost">
                Découvrir le programme revendeur
              </Button>
            </div>
          </div>
        </section>
      </Container>

      <RevendeurCTA />

      {/* GUIDES SEO */}
      <Container>
        <section className="py-24">
          <SectionHeading
            eyebrow="Bien choisir"
            title={
              <>
                Nos guides <em className="italic text-terra">d'experts</em>
              </>
            }
            intro="Tout ce qu'il faut savoir avant d'investir dans un spa rigide."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {guides.map((g) => (
              <Link
                key={g.href}
                href={g.href}
                className="group block rounded-[20px] border border-line bg-card p-8 transition-all hover:-translate-y-1 hover:border-terra"
              >
                <Eyebrow>{g.eyebrow}</Eyebrow>
                <h3 className="mt-2.5 text-2xl">{g.title}</h3>
                <p className="mt-2 text-sm text-muted">{g.intro}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-terra">
                  Lire le guide →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </Container>

      <DevisCTA />
    </>
  );
}
