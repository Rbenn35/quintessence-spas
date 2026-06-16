import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/SectionHeading";
import { DevisCTA } from "@/components/DevisCTA";
import { CatalogueClient } from "./CatalogueClient";
import { type Gamme } from "@/lib/spas";
import { getAllSpas, getAllReviews, getGammes } from "@/lib/store";
import { statsForProduct, type Rating } from "@/lib/reviews";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catalogue des spas rigides premium",
  description:
    "Découvrez notre sélection de spas rigides haut de gamme, de 2 à 8 places. Filtrez par taille, gamme et budget. Devis gratuit, livraison partout en France.",
  alternates: { canonical: "/spas" },
};

type GammeFilter = Gamme | "Toutes";

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<{ gamme?: string }>;
}) {
  const sp = await searchParams;
  const spas = await getAllSpas();
  const reviews = await getAllReviews();
  const gammes = await getGammes();
  const ratings: Record<string, Rating> = Object.fromEntries(
    spas.map((s) => [s.slug, statsForProduct(reviews, s.slug)]),
  );
  const initialGamme: GammeFilter =
    sp.gamme && gammes.includes(sp.gamme) ? (sp.gamme as Gamme) : "Toutes";

  return (
    <>
      <Container>
        <section className="py-14 sm:py-20">
          <Eyebrow>Catalogue</Eyebrow>
          <h1 className="mt-3 max-w-2xl text-4xl sm:text-5xl">
            Nos spas rigides, de 2 à 8 places
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted">
            Une gamme resserrée et exigeante. Chaque modèle est sélectionné pour
            sa qualité de fabrication, son confort et sa performance
            énergétique. Tous nos spas sont livrés, installés et garantis par
            nos équipes.
          </p>

          <div className="mt-12">
            <CatalogueClient
              spas={spas}
              gammes={gammes}
              ratings={ratings}
              initialGamme={initialGamme}
            />
          </div>
        </section>
      </Container>

      <DevisCTA />
    </>
  );
}
