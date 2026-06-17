import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/SectionHeading";
import { Button } from "@/components/Button";
import { Placeholder } from "@/components/Placeholder";
import { ProductGallery } from "@/components/ProductGallery";
import { FeatureIcon, iconForFeature, type IconName } from "@/components/FeatureIcon";
import { StickyBuyBar } from "@/components/StickyBuyBar";
import { SpaCard } from "@/components/SpaCard";
import { DevisCTA } from "@/components/DevisCTA";
import { TrustStars } from "@/components/TrustStars";
import { ColorSelector } from "@/components/ColorSelector";
import { StockBadge } from "@/components/StockBadge";
import { FicheTechniqueButton } from "@/components/FicheTechniqueButton";
import { DeliveryFormulas } from "@/components/DeliveryFormulas";
import { JsonLd } from "@/components/JsonLd";
import {
  formatPrix,
  formatEuro,
  prixApresRemise,
  remiseEffectivePct,
  badgePersonnalise,
} from "@/lib/spas";
import {
  getAllSpas,
  getSpaBySlug,
  getReviewsForProduct,
  getAllReviews,
  getSettings,
  getAllAccessoires,
} from "@/lib/store";
import { reviewStats, statsForProduct, initiales } from "@/lib/reviews";
import { breadcrumbSchema } from "@/lib/seo";
import { site } from "@/lib/site";

// ISR : fiche mise en cache au CDN, régénérée au plus toutes les 10 min.
// Une modif produit/avis déclenche une revalidation immédiate.
export const revalidate = 600;

// Pré-génère toutes les fiches au build (cache CDN dès le 1er accès).
export async function generateStaticParams() {
  const spas = await getAllSpas();
  return spas.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const spa = await getSpaBySlug(slug);
  if (!spa) return {};

  const title = `${spa.name} · Spa rigide ${spa.places} places`;
  const description = `${spa.accroche} ${spa.places} places, ${spa.dimensions.largeur} × ${spa.dimensions.profondeur} cm. ${formatPrix(spa.prixIndicatif)}. Devis gratuit sous 48 h, livraison partout en France.`;

  return {
    title,
    description,
    alternates: { canonical: `/spas/${spa.slug}` },
    openGraph: { title, description, url: `${site.url}/spas/${spa.slug}` },
  };
}

export default async function SpaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const spa = await getSpaBySlug(slug);
  if (!spa) notFound();

  const allSpas = await getAllSpas();
  const autres = allSpas.filter((s) => s.slug !== spa.slug).slice(0, 3);
  const allReviews = await getAllReviews();
  const settings = await getSettings();

  const modeleLabel = `${spa.name} ${spa.places} places`;
  const devisHref = `/devis?modele=${encodeURIComponent(modeleLabel)}&spa=${spa.slug}`;

  const prixFinal = prixApresRemise(spa);
  const remise = remiseEffectivePct(spa);
  const badge = badgePersonnalise(spa);
  const economie =
    spa.prixIndicatif !== null && remise !== null
      ? spa.prixIndicatif - (prixFinal ?? 0)
      : 0;

  // Note agrégée (avis) pour les étoiles dans les résultats de recherche.
  const productRating = statsForProduct(allReviews, spa.slug);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: spa.name,
    description: spa.description,
    brand: { "@type": "Brand", name: site.name },
    category: `Spa rigide ${spa.gamme}`,
    ...(spa.photos?.length
      ? { image: spa.photos.map((p) => `${site.url}${p}`) }
      : {}),
    ...(productRating.count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: productRating.avg.toFixed(1),
            reviewCount: productRating.count,
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
    ...(prixFinal !== null
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "EUR",
            price: prixFinal,
            availability: "https://schema.org/InStock",
            url: `${site.url}/spas/${spa.slug}`,
          },
        }
      : {}),
  };

  const breadcrumbJsonLd = breadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Les spas", url: "/spas" },
    { name: spa.name, url: `/spas/${spa.slug}` },
  ]);

  const dims = `${spa.dimensions.largeur} × ${spa.dimensions.profondeur} × ${spa.dimensions.hauteur} cm`;
  const aDetails = !!(spa.caracteristiques && spa.caracteristiques.length);

  // Familles de caractéristiques (accordéon) : « Essentiel » + détails éventuels.
  const essentiel: [string, string][] = aDetails
    ? [
        ["Gamme", spa.gamme],
        ["Nombre de places", `${spa.places} personnes`],
        ["Dimensions", dims],
        ["Garantie", settings.stats.warranty],
      ]
    : [
        ["Gamme", spa.gamme],
        ["Nombre de places", `${spa.places} personnes`],
        ["Dimensions", dims],
        ["Jets d'hydromassage", `${spa.jets} jets`],
        ["Énergie", spa.consommation],
        ["Garantie", settings.stats.warranty],
      ];
  const familles = [
    { groupe: "Essentiel", items: essentiel },
    ...(spa.caracteristiques ?? []),
  ];

  const reassurance: { icon: IconName; label: string }[] = [
    { icon: "shield", label: `Garantie ${settings.stats.warranty}` },
    { icon: "truck", label: "Livraison & installation partout en France" },
    { icon: "lock", label: "Paiement 100 % sécurisé" },
    { icon: "clock", label: "Réponse sous 48 h" },
  ];

  // Ce qui est inclus (réel si fourni, sinon liste générique indicative).
  const inclus = spa.inclus ?? [
    "Spa et son habillage",
    "Appuie-têtes",
    "Filtre",
    "Mise en service par nos équipes",
  ];

  // Petit texte de présentation (1re phrase de la description).
  const ptIndex = spa.description.indexOf(". ");
  const presentationCourte =
    ptIndex > 0 ? spa.description.slice(0, ptIndex + 1) : spa.description;

  // Comparateur : les modèles de la gamme.
  const compares = allSpas.filter((s) => s.gamme === spa.gamme);

  // FAQ produit (+ données structurées).
  const faq = [
    {
      q: "Quels sont les délais de livraison ?",
      a: "En moyenne 4 à 6 semaines, livraison et mise en service comprises, partout en France.",
    },
    {
      q: `Comment se passe l'installation du ${spa.name} ?`,
      a: "Nos équipes s'occupent de tout. Il suffit d'un support plan et porteur et d'une alimentation électrique conforme, sur lesquels nous vous conseillons en amont.",
    },
    {
      q: "Peut-on l'utiliser en hiver ?",
      a: "Oui. L'isolation renforcée permet un usage toute l'année, avec une consommation maîtrisée.",
    },
    {
      q: "Quel entretien au quotidien ?",
      a: "Quelques minutes par semaine : contrôle du pH et du désinfectant, nettoyage du filtre. La lampe UV-C limite l'usage de produits.",
    },
  ];
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  // Avis clients (gérés dans le back-office).
  const reviews = await getReviewsForProduct(spa.slug);
  const { avg, count } = reviewStats(reviews);
  const avgStr = avg.toFixed(1).replace(".", ",");

  // Accessoires (gérés dans le back-office).
  const accessoires = (await getAllAccessoires()).filter((a) => a.active);

  return (
    <>
      <JsonLd data={productJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <Container>
        {/* Fil d'Ariane */}
        <nav aria-label="Fil d'Ariane" className="pt-8 text-sm text-muted">
          <Link href="/" className="hover:text-terra">
            Accueil
          </Link>{" "}
          /{" "}
          <Link href="/spas" className="hover:text-terra">
            Les spas
          </Link>{" "}
          / <span className="text-ink">{spa.name}</span>
        </nav>

        {/* En-tête produit */}
        <section className="grid gap-10 py-10 lg:grid-cols-2">
          <div>
            {spa.photos && spa.photos.length > 0 ? (
              <ProductGallery photos={spa.photos} name={spa.name} />
            ) : (
              <Placeholder
                from={spa.placeholder[0]}
                to={spa.placeholder[1]}
                label={`${spa.name} · galerie photo à venir`}
                className="aspect-square w-full"
              />
            )}

            {/* Réassurance, sous les photos */}
            <ul className="mt-5 grid grid-cols-2 gap-3 text-sm">
              {reassurance.map((r) => (
                <li
                  key={r.label}
                  className="flex items-center gap-2.5 rounded-xl border border-line bg-card px-3 py-2.5"
                >
                  <FeatureIcon name={r.icon} className="h-5 w-5 shrink-0 text-terra" />
                  <span>{r.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Eyebrow>Gamme {spa.gamme}</Eyebrow>
              {badge && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-terra px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                  <FeatureIcon
                    name={(spa.badgeIcon as IconName) || "plug"}
                    className="h-3.5 w-3.5 shrink-0"
                  />
                  {badge}
                </span>
              )}
            </div>
            <h1 className="mt-3 text-4xl sm:text-5xl">{spa.name}</h1>
            {count > 0 && (
              <a
                href="#avis"
                className="mt-3 inline-flex items-center gap-2 text-sm"
              >
                <TrustStars rating={avg} size="sm" />
                <span className="text-muted">
                  {avgStr}/5 · {count} avis
                </span>
              </a>
            )}
            <p className="mt-4 text-lg text-muted">{spa.accroche}</p>

            {/* Bloc prix + CTA principal (conversion) */}
            <div className="mt-6 rounded-2xl border border-line bg-cream p-6">
              {spa.prixIndicatif !== null && remise !== null ? (
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-lg text-muted line-through">
                      {formatEuro(spa.prixIndicatif)}
                    </span>
                    <span className="rounded-full bg-terra px-2.5 py-1 text-xs font-semibold text-white">
                      -{remise} %
                    </span>
                  </div>
                  <div className="mt-1 font-serif text-4xl text-terra">
                    {formatEuro(prixFinal ?? spa.prixIndicatif)}
                  </div>
                  <p className="mt-1 text-sm font-medium text-olive">
                    Soit {formatEuro(economie)} d'économie
                  </p>
                </div>
              ) : (
                <div className="font-serif text-3xl text-terra">
                  {formatPrix(spa.prixIndicatif)}
                </div>
              )}

              <p className="mt-3 text-sm text-muted">Prix TTC</p>

              {(spa.colorsCoque?.length || spa.colorsTablier?.length) && (
                <div className="mt-5 border-t border-line pt-5">
                  <ColorSelector
                    coque={spa.colorsCoque}
                    tablier={spa.colorsTablier}
                  />
                </div>
              )}

              <div className="mt-5">
                <Button
                  href={devisHref}
                  size="lg"
                  className="w-full shadow-lg shadow-terra/20"
                >
                  Demander mon devis pour le {spa.name}
                </Button>
                <FicheTechniqueButton slug={spa.slug} name={spa.name} />
              </div>
              <StockBadge
                status={spa.stockStatus}
                availableAt={spa.stockAvailableAt}
              />
              <p className="mt-3 text-center text-xs text-muted">
                Gratuit · sans engagement · réponse sous 48 h
              </p>

              {/* Présentation courte + ce qui est inclus (même carte) */}
              <div className="mt-6 border-t border-line pt-6">
                <p className="text-sm text-muted">{presentationCourte}</p>
                <h2 className="mt-4 text-lg font-semibold">Ce qui est inclus</h2>
                <ul className="mt-3 space-y-2.5 text-sm">
                  {inclus.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <FeatureIcon
                        name="check"
                        className="mt-0.5 h-5 w-5 shrink-0 text-terra"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </section>

        {/* Points forts */}
        <section className="border-t border-line py-16">
          <div className="max-w-2xl">
            <Eyebrow>Points forts</Eyebrow>
            <h2 className="mt-3 text-3xl sm:text-4xl">Pensé pour votre confort</h2>
            <p className="mt-4 text-muted">
              Chaque détail du {spa.name} est conçu pour une expérience de
              bien-être absolue, jour après jour.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {spa.pointsForts.map((pf, i) => {
              const icon = (spa.pointsFortsIcons?.[i] as IconName) ?? iconForFeature(pf);
              return (
                <div
                  key={pf}
                  className="flex items-center gap-4 rounded-2xl border border-line bg-card p-5"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-terra/10 text-terra">
                    <FeatureIcon name={icon} className="h-6 w-6" />
                  </span>
                  <span className="text-[15px] font-medium leading-snug">
                    {pf}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-10">
            <Button href={devisHref} size="lg">
              Recevoir mon devis gratuit
            </Button>
          </div>
        </section>

        {/* Présentation (gauche) + caractéristiques (droite) */}
        <section className="grid gap-12 border-t border-line py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <h2 className="text-3xl">Présentation</h2>
            <p className="mt-4 text-muted">{spa.description}</p>

            <h3 className="mt-10 text-2xl">Livraison &amp; installation</h3>
            <p className="mt-3 text-muted">
              Nos équipes assurent la livraison, la mise en place et la mise en
              service de votre spa partout en France. Nous vous conseillons en
              amont sur la préparation du support (dalle, terrasse) et
              l'alimentation électrique.
            </p>

            <h3 className="mt-8 text-2xl">Garantie &amp; SAV</h3>
            <p className="mt-3 text-muted">
              Ce modèle est couvert par une garantie de {settings.stats.warranty} et
              un service après-vente réactif partout en France.
            </p>

            <div className="mt-8">
              <Button href={devisHref} size="lg">
                Demander mon devis pour le {spa.name}
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-3xl">Caractéristiques</h2>
            <div className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card">
              {familles.map((f, idx) => (
                <details key={f.groupe} className="group" open={idx === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-3.5 text-base font-medium marker:hidden hover:text-terra">
                    {f.groupe}
                    <span className="text-2xl leading-none text-terra transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <dl className="px-5 pb-4">
                    {f.items.map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between gap-4 border-t border-line/70 py-2.5 text-sm"
                      >
                        <dt className="text-muted">{key}</dt>
                        <dd className="text-right font-medium">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Formules de livraison & installation */}
        <DeliveryFormulas formulas={spa.deliveryFormulas} />

        {/* Avis clients (style plateforme d'avis) */}
        {count > 0 && (
          <section id="avis" className="scroll-mt-28 border-t border-line py-16">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <span className="text-xl font-bold">
                {avg >= 4.5
                  ? "Excellent"
                  : avg >= 3.5
                    ? "Très bien"
                    : avg >= 2.5
                      ? "Bien"
                      : "Correct"}
              </span>
              <TrustStars rating={avg} size="lg" />
              <span className="text-sm text-muted">
                Note de {avgStr}/5 · {count} avis · clients Quintessence Spas
              </span>
            </div>
            <div className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:thin]">
              {reviews.map((r) => (
                <figure
                  key={r.id}
                  className="flex w-[300px] shrink-0 snap-start flex-col rounded-2xl border border-line bg-card p-5"
                >
                  <TrustStars rating={r.rating} size="md" />
                  <p className="mt-3 flex-1 text-sm">{r.text}</p>
                  <figcaption className="mt-4 flex items-center gap-3 border-t border-line pt-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-terra text-xs font-semibold text-white">
                      {initiales(r.author)}
                    </span>
                    <span className="text-sm leading-tight">
                      <b>{r.author}</b>
                      {r.city && (
                        <>
                          {" "}
                          <span className="text-muted">· {r.city}</span>
                        </>
                      )}
                      <br />
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-[#00b67a]">
                        <svg
                          viewBox="0 0 24 24"
                          width="13"
                          height="13"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        Avis vérifié
                      </span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* Comparateur */}
        {compares.length > 1 && (
          <section className="border-t border-line py-16">
            <h2 className="text-3xl">Comparer nos modèles</h2>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse overflow-hidden rounded-2xl border border-line">
                <thead>
                  <tr className="bg-cream text-left text-sm">
                    <th className="px-5 py-3 font-semibold">Modèle</th>
                    <th className="px-5 py-3 font-semibold">Places</th>
                    <th className="px-5 py-3 font-semibold">Jets</th>
                    <th className="px-5 py-3 font-semibold">Prix remisé</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {compares.map((c) => {
                    const pf = prixApresRemise(c);
                    const current = c.slug === spa.slug;
                    return (
                      <tr
                        key={c.slug}
                        className={`border-t border-line text-sm ${
                          current ? "bg-terra/5" : "bg-card"
                        }`}
                      >
                        <td
                          className={`px-5 py-3 font-medium ${
                            current ? "text-terra" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {c.photos?.[0] ? (
                              <Image
                                src={c.photos[0]}
                                alt={`Spa ${c.name}`}
                                width={48}
                                height={48}
                                className="h-12 w-12 shrink-0 rounded-lg object-cover"
                              />
                            ) : (
                              <span
                                className="h-12 w-12 shrink-0 rounded-lg"
                                style={{
                                  background: `linear-gradient(150deg, ${c.placeholder[0]}, ${c.placeholder[1]})`,
                                }}
                              />
                            )}
                            <span>
                              {c.name}
                              {current && " (ce modèle)"}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3">{c.places}</td>
                        <td className="px-5 py-3">{c.jets}</td>
                        <td
                          className={`px-5 py-3 ${
                            current ? "font-semibold text-terra" : ""
                          }`}
                        >
                          {pf !== null ? formatEuro(pf) : "Sur devis"}
                        </td>
                        <td className="px-5 py-3 text-right">
                          {!current && (
                            <Link
                              href={`/spas/${c.slug}`}
                              className="font-semibold text-terra"
                            >
                              Voir →
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="border-t border-line py-16">
          <div className="max-w-3xl">
            <h2 className="text-3xl">Questions fréquentes</h2>
            <div className="mt-8 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card">
              {faq.map((f) => (
                <details key={f.q} className="group p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium marker:hidden hover:text-terra">
                    {f.q}
                    <span className="text-2xl leading-none text-terra transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Accessoires */}
        {accessoires.length > 0 && (
          <section className="border-t border-line py-16">
            <h2 className="text-3xl">Pour compléter votre spa</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {accessoires.map((a, i) => (
                <div
                  key={a.id}
                  className="overflow-hidden rounded-2xl border border-line bg-card"
                >
                  {a.image ? (
                    <div
                      className="h-40 w-full bg-cover bg-center"
                      style={{ backgroundImage: `url('${a.image}')` }}
                    />
                  ) : (
                    <Placeholder
                      from={["#cfe2ea", "#d3e9ef", "#dcedf1"][i % 3]}
                      to={["#1c6e8e", "#2e7c8f", "#3a8aa0"][i % 3]}
                      rounded="rounded-none"
                      className="h-40 w-full"
                      label={`${a.name} · visuel à venir`}
                    />
                  )}
                  <div className="flex items-start justify-between gap-3 p-5">
                    <div>
                      <b>{a.name}</b>
                      <div className="mt-1 text-sm text-muted">
                        {a.description}
                      </div>
                    </div>
                    <span className="shrink-0 whitespace-nowrap text-sm font-medium text-terra">
                      {a.price === null ? "Sur devis" : formatEuro(a.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Autres modèles */}
        <section className="border-t border-line py-16">
          <h2 className="text-3xl">Autres modèles à découvrir</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {autres.map((s) => (
              <SpaCard
                key={s.slug}
                spa={s}
                rating={statsForProduct(allReviews, s.slug)}
              />
            ))}
          </div>
        </section>
      </Container>

      <DevisCTA modele={modeleLabel} />

      {prixFinal !== null && (
        <StickyBuyBar
          nom={spa.name}
          prixFinal={prixFinal}
          prixInitial={spa.prixIndicatif}
          remisePct={remise ?? undefined}
          devisHref={devisHref}
        />
      )}
    </>
  );
}
