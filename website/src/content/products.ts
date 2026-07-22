/**
 * Proprietary products CodingBull has built and operates — not client work.
 * These prove the company ships its own software, and each gets a crawlable
 * page plus SoftwareApplication schema.
 */

export interface ProductStep {
  title: string;
  description: string;
}

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  audience: string;
  /** Live application URL (external). */
  liveUrl: string;
  /** One-paragraph summary — used for meta description and page intro. */
  summary: string;
  /** Longer positioning paragraph for the dedicated page. */
  overview: string;
  steps: ProductStep[];
  features: string[];
  faqs: Array<{ question: string; answer: string }>;
}

export const products: Product[] = [
  {
    slug: 'remote-radar',
    name: 'RemoteRadar',
    tagline: 'The exact job you seek. On our radar.',
    category: 'Remote job aggregation platform',
    audience: 'Remote engineers and developers',
    liveUrl: 'https://remote-job-finder-five.vercel.app/',
    summary:
      'RemoteRadar is a CodingBull product that aggregates remote engineering roles from top-tier hubs, developer boards, and hidden startup pages into one fast, filterable feed — so developers stop tab-hopping and apply at the source.',
    overview:
      'We built RemoteRadar to prove our own thesis: the right system removes noise instead of adding it. It continuously pulls remote roles from many sources, normalises them into a single feed, and lets engineers filter to exactly the role they want, then apply directly on the original posting. No account walls, no re-listing friction — a focused tool that respects the user’s time.',
    steps: [
      {
        title: 'We find the roles',
        description:
          'An aggregation engine continuously pulls remote engineering positions from top-tier job hubs, developer boards, and hidden startup pages.',
      },
      {
        title: 'You filter the noise',
        description:
          'A fast interface lets you narrow by stack, seniority, and region to surface exactly the remote role you want — in seconds, not tabs.',
      },
      {
        title: 'You apply at the source',
        description:
          'RemoteRadar routes you straight to the original posting to apply. No re-listing friction, no middle-man account required.',
      },
    ],
    features: [
      'Continuous aggregation from multiple remote-job sources',
      'Fast filtering by stack, seniority, and region',
      'Direct routing to the original job posting',
      'Focused on remote engineering roles specifically',
    ],
    faqs: [
      {
        question: 'What is RemoteRadar?',
        answer:
          'RemoteRadar is a remote-job aggregation platform built by CodingBull Technovations. It collects remote engineering roles from many sources into one searchable, filterable feed and links applicants directly to the original posting.',
      },
      {
        question: 'Who is RemoteRadar for?',
        answer:
          'It is built for remote engineers and developers who want to find relevant remote roles quickly without checking dozens of separate job boards.',
      },
      {
        question: 'Does RemoteRadar host the jobs itself?',
        answer:
          'No. RemoteRadar aggregates and organises listings, then routes you to apply on the original source platform.',
      },
    ],
  },
];

export const productsBySlug: Record<string, Product> = Object.fromEntries(
  products.map((product) => [product.slug, product]),
);
