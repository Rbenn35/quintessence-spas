import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/SectionHeading";
import { DevisForm } from "./DevisForm";
import { getSettings } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Demander un devis gratuit",
  description:
    "Recevez votre devis personnalisé et gratuit en quelques secondes. Quelques coordonnées suffisent, réponse sous 48 h par un conseiller.",
  alternates: { canonical: "/devis" },
};

const reassurance = [
  "Gratuit et sans engagement",
  "Réponse sous 48 h",
  "Livraison et installation partout en France",
  "Paiement 100 % sécurisé",
];

export default async function DevisPage({
  searchParams,
}: {
  searchParams: Promise<{ modele?: string; spa?: string }>;
}) {
  const sp = await searchParams;
  const site = await getSettings();
  const modele = sp.modele?.trim() || undefined;
  const slug = sp.spa?.trim() || undefined;

  return (
    <Container>
      <section className="grid gap-12 py-14 sm:py-20 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <Eyebrow>Devis gratuit</Eyebrow>
          <h1 className="mt-3 text-4xl sm:text-5xl">
            {modele ? (
              <>
                Votre devis pour le{" "}
                <span className="text-terra">{modele}</span>
              </>
            ) : (
              "Recevez votre devis en 30 secondes"
            )}
          </h1>
          <p className="mt-5 text-lg text-muted">
            Laissez-nous vos coordonnées, c'est tout. Un conseiller vous
            recontacte rapidement avec une proposition personnalisée, adaptée à
            votre projet et à votre budget.
          </p>

          <ul className="mt-8 space-y-3 text-sm">
            {reassurance.map((r) => (
              <li key={r} className="flex gap-3">
                <span className="mt-1 text-terra">◆</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-2xl border border-line bg-cream p-6">
            <p className="text-sm text-muted">Une question avant de vous lancer ?</p>
            <a
              href={`mailto:${site.email}`}
              className="mt-1 block break-all font-serif text-xl text-terra"
            >
              {site.email}
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-card p-6 shadow-sm sm:p-8">
          {modele && (
            <div className="mb-6 flex items-center gap-3 rounded-xl bg-terra/10 px-4 py-3 text-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-terra" />
              <span>
                Demande pour le modèle{" "}
                <strong className="font-semibold text-ink">{modele}</strong>
              </span>
            </div>
          )}
          <DevisForm modele={modele} slug={slug} />
        </div>
      </section>
    </Container>
  );
}
