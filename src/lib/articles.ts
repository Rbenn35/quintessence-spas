/**
 * Modèle d'article de blog (« Guides »). Le contenu est du HTML, éditable
 * dans le back-office (rédaction classique ou HTML). Les cards CTA produit
 * sont des fragments HTML insérés dans `content`.
 */
export interface ArticleFaq {
  q: string;
  a: string;
}

export interface Article {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  /** Dégradé de la vignette : [clair, foncé]. */
  tint: [string, string];
  readMin: number;
  /** Image de couverture (chemin /public) ; sinon dégradé. */
  cover?: string;
  /** Corps de l'article en HTML. */
  content: string;
  faq?: ArticleFaq[];
  published: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export const seedArticles: Article[] = [
  {
    slug: "guide-achat-spa-rigide",
    title: "Guide d'achat du spa rigide",
    category: "Guide",
    excerpt:
      "Places, dimensions, budget, énergie, installation : la méthode complète pour choisir sereinement, sans mauvaise surprise.",
    tint: ["#2e7c8f", "#13313d"],
    readMin: 8,
    published: true,
    content: `
<p>Investir dans un spa rigide est un choix qui vous accompagnera de nombreuses années. Voici tous les critères à passer en revue pour choisir sereinement.</p>
<h2>Qu'est-ce qu'un spa rigide ?</h2>
<p>Un spa rigide, ou spa en dur, est une cuve thermoformée habillée d'une structure isolée, par opposition au spa gonflable. C'est la solution durable, confortable et performante sur le plan énergétique.</p>
<ul>
<li>Durée de vie de 10 à 20 ans selon l'entretien</li>
<li>Assises ergonomiques et hydromassage puissant</li>
<li>Isolation permettant un usage toute l'année</li>
</ul>
<h2>Combien de places choisir ?</h2>
<p>Un spa annoncé pour 6 personnes est confortable à 4 au quotidien. Partez de votre usage réel plutôt que du maximum théorique.</p>
<h2>Budget : prix d'achat et coût d'usage</h2>
<p>Le coût réel dépend autant de l'isolation que du prix d'achat. Un spa bien isolé, compatible pompe à chaleur, réduit fortement la facture sur la durée.</p>`,
    faq: [
      {
        q: "Quel budget prévoir pour un spa rigide de qualité ?",
        a: "Comptez généralement entre 7 000 € et 16 000 € selon le nombre de places, l'équipement et les finitions. La livraison et l'installation sont à ajouter.",
      },
      {
        q: "Peut-on utiliser un spa rigide en hiver ?",
        a: "Oui, c'est l'un de ses grands atouts. Grâce à son isolation, il s'utilise toute l'année avec une consommation maîtrisée.",
      },
    ],
  },
  {
    slug: "spa-rigide-vs-gonflable",
    title: "Spa rigide ou gonflable ?",
    category: "Comparatif",
    excerpt:
      "Durabilité, confort, consommation et coût réel sur la durée : le comparatif honnête.",
    tint: ["#d3e9ef", "#2e7c8f"],
    readMin: 6,
    published: true,
    content: `
<p>Le spa gonflable séduit par son prix d'appel, le spa rigide par sa durabilité et son confort. Lequel est fait pour vous ?</p>
<h2>Confort et massage</h2>
<p>Le spa rigide offre des assises moulées et des jets ciblés. Le gonflable se limite le plus souvent à des bulles d'air, agréables mais diffuses.</p>
<h2>Durabilité</h2>
<p>Un gonflable dure 2 à 5 ans ; un spa rigide de qualité, 10 à 20 ans. Sur la durée, le rigide est souvent plus économique malgré un prix d'achat supérieur.</p>
<h2>Consommation</h2>
<p>Mieux isolé, le spa rigide maintient sa température bien plus efficacement, surtout en hiver.</p>`,
    faq: [
      {
        q: "Le spa rigide consomme-t-il vraiment moins ?",
        a: "Oui, à usage équivalent. Son isolation renforcée et sa compatibilité pompe à chaleur le rendent bien plus efficace, surtout en hiver.",
      },
    ],
  },
  {
    slug: "installation-entretien-spa",
    title: "Installation & entretien d'un spa",
    category: "Pratique",
    excerpt:
      "Préparer le support, traiter l'eau, hiverner : nos conseils d'installateurs.",
    tint: ["#dcedf1", "#3a8aa0"],
    readMin: 7,
    published: true,
    content: `
<p>Un spa bien installé et entretenu, c'est une eau saine, une consommation maîtrisée et un équipement qui dure.</p>
<h2>Préparer le support</h2>
<p>Le support doit être plan, stable et porteur (souvent plus de 1,5 tonne en charge). Une dalle béton est l'idéal.</p>
<h2>Entretenir l'eau</h2>
<ul>
<li>Contrôler le pH chaque semaine</li>
<li>Vérifier le niveau de désinfectant</li>
<li>Nettoyer les filtres régulièrement</li>
</ul>
<h2>Hivernage</h2>
<p>Le spa rigide peut rester en eau et chauffé tout l'hiver (hivernage actif), prêt à l'emploi grâce à son isolation.</p>`,
    faq: [
      {
        q: "Faut-il obligatoirement une dalle béton ?",
        a: "C'est la solution la plus sûre. Une terrasse parfaitement plane et porteuse peut convenir ; nous le vérifions avec vous avant l'installation.",
      },
    ],
  },
  {
    slug: "consommation-spa-rigide",
    title: "Combien consomme un spa rigide ?",
    category: "Énergie",
    excerpt:
      "Estimer et maîtriser le coût d'usage annuel selon l'isolation et le chauffage.",
    tint: ["#cde6ec", "#14566e"],
    readMin: 5,
    published: true,
    content: `
<p>La consommation dépend surtout de l'isolation, du chauffage et de votre usage. Voici comment la maîtriser.</p>
<h2>Ce qui fait varier la facture</h2>
<ul>
<li>Qualité de l'isolation et de la couverture</li>
<li>Température de consigne et fréquence d'usage</li>
<li>Type de chauffage (réchauffeur ou pompe à chaleur)</li>
</ul>
<h2>Nos astuces</h2>
<p>Une couverture de qualité bien fermée, une consigne raisonnable et la filtration sur les heures creuses réduisent nettement la facture.</p>`,
    faq: [
      {
        q: "La pompe à chaleur est-elle rentable ?",
        a: "Pour un usage régulier, elle réduit fortement le coût de chauffe. Nos spas sont pré-équipés d'un by-pass pour l'accueillir.",
      },
    ],
  },
  {
    slug: "quelle-taille-de-spa",
    title: "Quelle taille de spa choisir ?",
    category: "Conseils",
    excerpt: "2, 4, 6 places : bien dimensionner selon votre usage réel.",
    tint: ["#cfe2ea", "#1c6e8e"],
    readMin: 5,
    published: true,
    content: `
<p>Le nombre de places conditionne le confort, l'encombrement et le coût d'usage.</p>
<h2>Partez de votre usage réel</h2>
<ul>
<li>2 à 3 places : couples, petites terrasses</li>
<li>4 à 5 places : usage familial, le plus courant</li>
<li>6 places et plus : convivialité, grands extérieurs</li>
</ul>
<h2>Espace et accès</h2>
<p>Gardez un dégagement pour la maintenance et vérifiez l'accès de livraison. Un spa surdimensionné coûte plus cher à l'usage.</p>`,
    faq: [
      {
        q: "Vaut-il mieux voir trop grand ou trop juste ?",
        a: "Dimensionnez au plus proche de votre usage quotidien : un spa trop grand est plus cher à l'achat comme à l'usage.",
      },
    ],
  },
  {
    slug: "bienfaits-du-spa",
    title: "Les bienfaits du spa au quotidien",
    category: "Bien-être",
    excerpt:
      "Récupération musculaire, sommeil, détente : ce que l'on sait des effets du spa.",
    tint: ["#d3e9ef", "#2e7c8f"],
    readMin: 4,
    published: true,
    content: `
<p>Au-delà du plaisir, l'eau chaude et l'hydromassage ont des effets concrets sur le corps et l'esprit.</p>
<h2>Détente musculaire</h2>
<p>La chaleur favorise la circulation et les jets ciblent les tensions : idéal après le sport ou une longue journée.</p>
<h2>Un meilleur sommeil</h2>
<p>Une immersion en soirée, puis le refroidissement progressif du corps, accompagnent l'endormissement.</p>`,
    faq: [
      {
        q: "Combien de temps rester dans un spa ?",
        a: "15 à 20 minutes suffisent généralement. Hydratez-vous et écoutez votre corps.",
      },
    ],
  },
];
