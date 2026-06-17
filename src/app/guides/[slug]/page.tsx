import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { DevisCTA } from "@/components/DevisCTA";
import { getAllArticles, getArticleBySlug } from "@/lib/store";
import { site } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/seo";

export const revalidate = 600;

// Pré-génère tous les articles publiés au build (cache CDN dès le 1er accès).
export async function generateStaticParams() {
  const articles = (await getAllArticles()).filter((a) => a.published);
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticleBySlug(slug);
  if (!a) return {};
  const title = a.metaTitle || a.title;
  const description = a.metaDescription || a.excerpt;
  return {
    title,
    description,
    alternates: { canonical: `/guides/${a.slug}` },
    openGraph: { title, description, url: `${site.url}/guides/${a.slug}` },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = await getArticleBySlug(slug);
  if (!a || !a.published) notFound();

  const others = (await getAllArticles())
    .filter((x) => x.published && x.slug !== a.slug)
    .slice(0, 3);

  const faqJsonLd =
    a.faq && a.faq.length
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: a.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.metaDescription || a.excerpt,
    inLanguage: "fr-FR",
    mainEntityOfPage: `${site.url}/guides/${a.slug}`,
    ...(a.cover ? { image: `${site.url}${a.cover}` } : {}),
    author: { "@type": "Organization", name: site.name },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: {
        "@type": "ImageObject",
        url: `${site.url}/brand/logo.png`,
      },
    },
  };

  const breadcrumbJsonLd = breadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Guides", url: "/guides" },
    { name: a.title, url: `/guides/${a.slug}` },
  ]);

  return (
    <>
      <JsonLd data={articleJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <JsonLd data={breadcrumbJsonLd} />

      <Container>
        <article className="py-12 sm:py-16">
          <nav aria-label="Fil d'Ariane" className="text-sm text-muted">
            <Link href="/" className="hover:text-terra">
              Accueil
            </Link>{" "}
            /{" "}
            <Link href="/guides" className="hover:text-terra">
              Guides
            </Link>{" "}
            / <span className="text-ink">{a.title}</span>
          </nav>

          <header className="mt-6 max-w-3xl">
            <span className="inline-block rounded-full bg-terra/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-terra">
              {a.category} · {a.readMin} min
            </span>
            <h1 className="mt-3 text-4xl sm:text-5xl">{a.title}</h1>
            <p className="mt-5 text-lg text-muted">{a.excerpt}</p>
          </header>

          {a.cover && (
            <div
              className="mt-8 h-72 w-full max-w-3xl rounded-2xl bg-cover bg-center lg:h-96"
              style={{ backgroundImage: `url('${a.cover}')` }}
            />
          )}

          <div
            className="article-content mt-10 max-w-3xl"
            dangerouslySetInnerHTML={{ __html: a.content }}
          />

          {a.faq && a.faq.length > 0 && (
            <section className="mt-14 max-w-3xl">
              <h2 className="text-3xl">Questions fréquentes</h2>
              <div className="mt-6 divide-y divide-line rounded-2xl border border-line bg-card">
                {a.faq.map((item) => (
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
            </section>
          )}

          {others.length > 0 && (
            <section className="mt-16 border-t border-line pt-12">
              <h2 className="text-2xl sm:text-3xl">À lire aussi</h2>
              <div className="mt-6 grid gap-6 md:grid-cols-3">
                {others.map((o) => (
                  <Link
                    key={o.slug}
                    href={`/guides/${o.slug}`}
                    className="group overflow-hidden rounded-[18px] border border-line bg-card transition hover:-translate-y-1"
                  >
                    <div
                      className="h-36 w-full bg-cover bg-center"
                      style={{
                        backgroundImage: o.cover
                          ? `url('${o.cover}')`
                          : `linear-gradient(150deg, ${o.tint[0]}, ${o.tint[1]})`,
                      }}
                    />
                    <div className="p-5">
                      <h3 className="text-lg group-hover:text-terra">
                        {o.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-muted">{o.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </Container>

      <DevisCTA />
    </>
  );
}
