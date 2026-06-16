import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/SectionHeading";
import { DevisCTA } from "@/components/DevisCTA";
import { TrustBar } from "@/components/TrustBar";

export const metadata: Metadata = {
  title: "La marque Quintessence Spas",
  description:
    "Découvrez Quintessence Spas : plus de 15 ans d'expertise dans le spa rigide premium, une exigence de qualité et un accompagnement de A à Z partout en France.",
  alternates: { canonical: "/marque" },
};

const valeurs = [
  {
    titre: "L'exigence de la qualité",
    texte:
      "Nous ne retenons que des spas rigides à la fabrication irréprochable, sélectionnés pour leur durabilité et leur confort réel.",
  },
  {
    titre: "Le conseil avant tout",
    texte:
      "Un spa est un investissement. Nos conseillers prennent le temps de comprendre votre usage pour vous orienter vers le bon modèle, sans surenchère.",
  },
  {
    titre: "L'accompagnement durable",
    texte:
      "De la livraison à l'entretien, en passant par le SAV, nous restons à vos côtés bien après l'achat, partout en France.",
  },
];

export default function MarquePage() {
  return (
    <>
      <Container>
        <section className="grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-2">
          <div>
            <Eyebrow>La marque</Eyebrow>
            <h1 className="mt-3 text-4xl sm:text-5xl">
              Quintessence Spas, l'art du bien-être qui dure
            </h1>
            <p className="mt-5 text-lg text-muted">
              Depuis plus de 15 ans, Quintessence Spas accompagne les
              particuliers dans le choix et l'installation de spas rigides haut
              de gamme. Notre conviction : le vrai luxe se mesure à la qualité de
              fabrication, au confort ressenti et à la sérénité d'un
              accompagnement durable.
            </p>
          </div>
          <div className="relative h-72 w-full overflow-hidden rounded-2xl lg:h-96">
            <Image
              src="/brand/equipe-installation.jpg"
              alt="Un conseiller Quintessence Spas présente un spa rigide installé à un couple, devant une maison contemporaine"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </section>
      </Container>

      <TrustBar />

      <Container>
        <section className="py-24">
          <h2 className="max-w-2xl text-3xl sm:text-4xl">Nos valeurs</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {valeurs.map((v) => (
              <div
                key={v.titre}
                className="rounded-2xl border border-line bg-card p-8"
              >
                <h3 className="text-2xl">{v.titre}</h3>
                <p className="mt-3 text-muted">{v.texte}</p>
              </div>
            ))}
          </div>
        </section>
      </Container>

      <div className="border-t border-line bg-cream">
        <Container>
          <section className="grid gap-12 py-24 lg:grid-cols-2 lg:items-center">
            <div>
              <Eyebrow>Notre engagement</Eyebrow>
              <h2 className="mt-3 text-3xl sm:text-4xl">
                Un interlocuteur, du premier conseil au dernier entretien
              </h2>
              <p className="mt-4 text-muted">
                Choisir Quintessence, c'est confier son projet à une équipe qui
                maîtrise toute la chaîne : sélection des modèles, conseil
                personnalisé, livraison, installation, mise en service et
                service après-vente. Vous n'êtes jamais seul face à votre spa.
              </p>
              <p className="mt-4 text-muted">
                Cette page présentera bientôt notre histoire, nos
                certifications et les coulisses de notre savoir-faire. Le contenu
                définitif sera intégré avec vos textes et vos photos.
              </p>
            </div>
            <div className="relative h-72 w-full overflow-hidden rounded-2xl lg:h-96">
              <Image
                src="/brand/conseil-showroom.jpg"
                alt="Un conseiller Quintessence Spas accompagne un couple dans le choix de leur spa, en showroom"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </section>
        </Container>
      </div>

      <DevisCTA />
    </>
  );
}
