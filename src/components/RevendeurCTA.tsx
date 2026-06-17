import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { Eyebrow } from "@/components/SectionHeading";

/** Bandeau de conversion B2B : devenir revendeur / distributeur. */
export function RevendeurCTA() {
  return (
    <section className="bg-footer py-20 text-center text-white">
      <Container>
        <Eyebrow className="text-gold">Professionnels</Eyebrow>
        <h2 className="mx-auto mt-3 max-w-2xl text-4xl text-white sm:text-5xl">
          Devenez revendeur Quintessence Spas
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">
          Pisciniste, paysagiste, revendeur ? Distribuez une gamme de spas
          rigides premium avec des marges attractives, du stock en France et un
          accompagnement complet.
        </p>
        <div className="mt-8">
          <Button
            href="/revendeur"
            variant="light"
            size="lg"
            className="shadow-lg shadow-black/20"
          >
            Devenir revendeur
          </Button>
        </div>
        <p className="mt-5 text-sm text-white/70">
          Réservé aux professionnels · réponse sous 48 h
        </p>
      </Container>
    </section>
  );
}
