import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { Eyebrow } from "@/components/SectionHeading";

/**
 * Bloc de conversion « devis ».
 * Vente 100 % en ligne : on pousse vers la demande de devis.
 * Si `modele` est fourni, le devis est pré-rempli pour ce modèle.
 */
export function DevisCTA({ modele }: { modele?: string }) {
  const href = modele
    ? `/devis?modele=${encodeURIComponent(modele)}`
    : "/devis";

  return (
    <section className="bg-terra py-20 text-center text-white">
      <Container>
        <Eyebrow className="text-white/90">Devis gratuit en ligne</Eyebrow>
        <h2 className="mx-auto mt-3 max-w-2xl text-4xl text-white sm:text-5xl">
          {modele
            ? `Recevez votre prix pour le ${modele}`
            : "Recevez votre devis personnalisé"}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
          Gratuit, sans engagement, réponse sous 48 h. Il vous suffit de vos
          coordonnées, on s'occupe du reste.
        </p>
        <div className="mt-8">
          <Button
            href={href}
            variant="light"
            size="lg"
            className="shadow-lg shadow-black/10"
          >
            Demander mon devis gratuit
          </Button>
        </div>
        <p className="mt-5 text-sm text-white/85">
          Paiement sécurisé · Livraison et installation partout en France
        </p>
      </Container>
    </section>
  );
}
