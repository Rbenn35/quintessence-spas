import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/SectionHeading";
import { getAllArticles } from "@/lib/store";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Guides & conseils sur le spa rigide",
  description:
    "Tous nos guides et conseils pour bien choisir, installer et entretenir votre spa rigide : achat, comparatif, énergie, entretien, bien-être.",
  alternates: { canonical: "/guides" },
};

const chip =
  "inline-block rounded-full bg-terra/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-terra";

function cover(tint: [string, string], coverImg?: string): string {
  return coverImg
    ? `url('${coverImg}')`
    : `linear-gradient(150deg, ${tint[0]}, ${tint[1]})`;
}

export default async function GuidesIndex() {
  const articles = (await getAllArticles()).filter((a) => a.published);
  const [featured, ...rest] = articles;
  const side = rest.slice(0, 2);
  const grid = rest.slice(2);

  if (!featured) {
    return (
      <Container>
        <section className="py-20">
          <h1 className="text-4xl">Guides &amp; conseils</h1>
          <p className="mt-4 text-muted">Aucun article pour le moment.</p>
        </section>
      </Container>
    );
  }

  return (
    <Container>
      <section className="py-12 sm:py-16">
        <Eyebrow>Le magazine</Eyebrow>
        <h1 className="mt-3 text-4xl sm:text-5xl">Guides &amp; conseils</h1>
        <p className="mt-4 max-w-xl text-lg text-muted">
          Tout ce qu'il faut savoir pour bien choisir, installer et profiter de
          votre spa rigide.
        </p>

        {/* À la une + colonne de droite */}
        <div className="mt-10 grid gap-6 lg:grid-cols-[2.2fr_1fr]">
          <Link
            href={`/guides/${featured.slug}`}
            className="group relative flex min-h-[180px] items-end overflow-hidden rounded-[22px] bg-cover bg-center p-8 text-white lg:min-h-[210px]"
            style={{ backgroundImage: cover(featured.tint, featured.cover) }}
          >
            <span className="absolute inset-0 bg-gradient-to-t from-ink/55 to-transparent" />
            <div className="relative">
              <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider backdrop-blur">
                À la une · {featured.category}
              </span>
              <h2 className="mt-3 max-w-xl text-3xl text-white sm:text-4xl">
                {featured.title}
              </h2>
              <p className="mt-2 max-w-md text-white/90">{featured.excerpt}</p>
              <span className="mt-4 inline-block font-semibold">
                Lire le guide →
              </span>
            </div>
          </Link>

          <div className="flex flex-col gap-4">
            {side.map((a) => (
              <Link
                key={a.slug}
                href={`/guides/${a.slug}`}
                className="group flex flex-1 items-center gap-4 overflow-hidden rounded-2xl border border-line bg-card p-3 transition hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(19,49,61,0.10)]"
              >
                <div
                  className="h-20 w-24 shrink-0 rounded-xl bg-cover bg-center"
                  style={{ backgroundImage: cover(a.tint, a.cover) }}
                />
                <div className="min-w-0 py-0.5">
                  <span className={chip}>{a.category}</span>
                  <h3 className="mt-1.5 line-clamp-2 text-base leading-snug group-hover:text-terra">
                    {a.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Grille */}
        {grid.length > 0 && (
          <>
            <h2 className="mt-16 text-2xl sm:text-3xl">Tous les articles</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {grid.map((a) => (
                <Link
                  key={a.slug}
                  href={`/guides/${a.slug}`}
                  className="group overflow-hidden rounded-[18px] border border-line bg-card transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(19,49,61,0.10)]"
                >
                  <div
                    className="h-44 w-full bg-cover bg-center"
                    style={{ backgroundImage: cover(a.tint, a.cover) }}
                  />
                  <div className="p-6">
                    <span className={chip}>{a.category}</span>
                    <h3 className="mt-2.5 text-xl group-hover:text-terra">
                      {a.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted">{a.excerpt}</p>
                    <span className="mt-3 inline-block text-sm font-semibold text-terra">
                      Lire →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </Container>
  );
}
