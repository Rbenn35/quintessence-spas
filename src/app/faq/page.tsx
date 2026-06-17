import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/SectionHeading";
import { DevisCTA } from "@/components/DevisCTA";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Questions fréquentes sur les spas rigides",
  description:
    "Toutes les réponses sur les spas rigides Quintessence : prix, livraison, installation, entretien, garantie, et conditions pour devenir revendeur ou distributeur en France.",
  alternates: { canonical: "/faq" },
};

/**
 * FAQ générale du site. Contenu pensé pour le SEO (featured snippets) et le
 * GEO (réponses courtes, factuelles et citables par les IA génératives).
 * Réponses « directes d'abord », puis précision.
 */
type QA = { q: string; a: string };
type Section = { titre: string; intro: string; items: QA[] };

const sections: Section[] = [
  {
    titre: "Les spas rigides Quintessence",
    intro:
      "L'essentiel à savoir sur nos spas rigides premium, leur achat et leur usage.",
    items: [
      {
        q: "Qu'est-ce qu'un spa rigide ?",
        a: "Un spa rigide est un spa à coque acrylique renforcée et structure isolée, conçu pour une installation durable et un usage toute l'année. Contrairement au spa gonflable, il offre une meilleure isolation, des jets d'hydromassage puissants et une longévité de plusieurs années.",
      },
      {
        q: "Quel est le prix d'un spa rigide premium ?",
        a: "Un spa rigide premium se situe généralement entre 8 000 et 15 000 € TTC selon le nombre de places, la motorisation et les équipements. Chez Quintessence Spas, le prix indiqué comprend la livraison, l'installation et la mise en service partout en France.",
      },
      {
        q: "Combien de temps pour être livré et installé ?",
        a: "Comptez en moyenne 4 à 6 semaines entre la commande et la mise en service, livraison et installation comprises, partout en France métropolitaine.",
      },
      {
        q: "Peut-on utiliser un spa rigide toute l'année, même en hiver ?",
        a: "Oui. L'isolation renforcée des spas rigides permet un usage par tous les temps, y compris en hiver, avec une consommation énergétique maîtrisée grâce à la couverture thermique et au système de chauffe.",
      },
      {
        q: "Quel entretien demande un spa rigide ?",
        a: "Quelques minutes par semaine suffisent : contrôle du pH et du désinfectant, nettoyage régulier du filtre et vidange tous les 3 à 4 mois. Une lampe UV-C, présente sur la plupart de nos modèles, limite l'usage de produits chimiques.",
      },
      {
        q: "Quelle garantie sur les spas Quintessence ?",
        a: "Nos spas sont garantis 5 ans. Nos équipes assurent le suivi, le service après-vente et le conseil bien après l'achat, partout en France.",
      },
    ],
  },
  {
    titre: "Devenir revendeur ou distributeur",
    intro:
      "Quintessence Spas est un fournisseur français de spas rigides pour les professionnels : revendeurs, piscinistes, paysagistes et hôtellerie de plein air.",
    items: [
      {
        q: "Comment devenir revendeur de spas Quintessence ?",
        a: "Il suffit de remplir le formulaire de la page Devenir revendeur en indiquant votre société, votre activité et vos coordonnées. Nous répondons à chaque candidature sous 48 heures pour étudier ensemble un partenariat de distribution.",
      },
      {
        q: "Quelle marge un revendeur peut-il espérer sur un spa rigide ?",
        a: "Les marges de revente sur un spa rigide premium se situent généralement entre 25 et 40 % selon le modèle, le volume et le positionnement. Nos tarifs grossistes sont pensés pour préserver la rentabilité de nos partenaires.",
      },
      {
        q: "Faut-il un showroom pour revendre vos spas ?",
        a: "Ce n'est pas obligatoire. De nombreux piscinistes et paysagistes vendent nos spas sur la base de leurs projets d'aménagement. Un espace d'exposition reste un atout pour concrétiser les ventes, et nous accompagnons nos partenaires sur ce point.",
      },
      {
        q: "Quels professionnels peuvent distribuer vos spas ?",
        a: "Nos partenaires types sont les piscinistes, paysagistes, magasins spécialisés bien-être, ainsi que les acteurs de l'hôtellerie de plein air (hôtels, campings) qui souhaitent équiper ou revendre des spas rigides.",
      },
      {
        q: "Les spas sont-ils en stock en France ?",
        a: "Oui. La disponibilité en France est un élément clé pour un revendeur : elle réduit les délais de livraison à vos clients et sécurise vos ventes. Nous maintenons un stock pour répondre rapidement à la demande.",
      },
    ],
  },
];

export default function FaqPage() {
  const allItems = sections.flatMap((s) => s.items);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allItems.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const breadcrumbJsonLd = breadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Questions fréquentes", url: "/faq" },
  ]);

  return (
    <>
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <Container>
        <section className="py-14 sm:py-20">
          <nav aria-label="Fil d'Ariane" className="text-sm text-muted">
            <Link href="/" className="hover:text-terra">
              Accueil
            </Link>{" "}
            / <span className="text-ink">Questions fréquentes</span>
          </nav>

          <Eyebrow className="mt-6">Aide & conseils</Eyebrow>
          <h1 className="mt-3 max-w-3xl text-4xl sm:text-5xl">
            Questions fréquentes sur les spas rigides
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted">
            Prix, livraison, installation, entretien, garantie et partenariats
            revendeur : voici les réponses aux questions que l'on nous pose le
            plus souvent. Une question sans réponse ?{" "}
            <Link href="/contact" className="text-terra underline">
              Contactez-nous
            </Link>
            .
          </p>

          <div className="mt-14 space-y-16">
            {sections.map((section) => (
              <div key={section.titre} className="max-w-3xl">
                <h2 className="text-3xl">{section.titre}</h2>
                <p className="mt-3 text-muted">{section.intro}</p>
                <div className="mt-6 divide-y divide-line rounded-2xl border border-line bg-card">
                  {section.items.map((item) => (
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
            ))}
          </div>

          <div className="mt-16 max-w-3xl rounded-2xl border border-line bg-card p-8">
            <h2 className="text-2xl">Vous êtes un professionnel ?</h2>
            <p className="mt-3 text-muted">
              Revendeur, pisciniste, paysagiste ou acteur de l'hôtellerie de
              plein air : découvrez les conditions pour distribuer nos spas
              rigides premium en France.
            </p>
            <Link
              href="/revendeur"
              className="mt-5 inline-block rounded-full bg-terra px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink"
            >
              Devenir revendeur
            </Link>
          </div>
        </section>
      </Container>

      <DevisCTA />
    </>
  );
}
