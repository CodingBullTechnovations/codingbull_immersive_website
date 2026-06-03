import Link from 'next/link';
import { ArrowUpRight, MapPin, ShoppingCart, Stethoscope, UsersRound, Workflow } from 'lucide-react';
import { PageHero } from '@/components/sections/PageHero';
import { CTASection } from '@/components/sections/CTASection';
import { homeContent } from '@/content/home';
import { insights } from '@/content/insights';
import { pageMetadata, generatePageMetadata } from '@/lib/seo';
import { getPublishedInsightBySlug, listInsightSlugStatuses } from '@/lib/server/public-content';
import { ContentStatus } from '@prisma/client';

export const metadata = generatePageMetadata(pageMetadata.insights);

const ACCENT_COLORS: Record<string, { border: string; bg: string; text: string }> = {
  teal: { border: 'border-teal/20', bg: 'bg-teal/[0.05]', text: 'text-teal' },
  amber: { border: 'border-amber-400/20', bg: 'bg-amber-400/[0.05]', text: 'text-amber-400' },
  violet: { border: 'border-violet-400/20', bg: 'bg-violet-400/[0.05]', text: 'text-violet-400' },
  sky: { border: 'border-sky-400/20', bg: 'bg-sky-400/[0.05]', text: 'text-sky-400' },
  rose: { border: 'border-rose-400/20', bg: 'bg-rose-400/[0.05]', text: 'text-rose-400' },
};

const INSIGHT_CLUSTERS = [
  {
    label: 'Healthcare Software',
    href: '/services/healthcare-software-development',
    summary: 'Medical software development, clinic workflows, appointment engines, compliance-aware backend planning.',
    icon: Stethoscope,
    accent: ACCENT_COLORS.teal,
    count: '4 guides',
  },
  {
    label: 'E-commerce Systems',
    href: '/services/ecommerce-development',
    summary: 'Custom storefronts, inventory movement, order automation, B2B pricing, SEO-first commerce architecture.',
    icon: ShoppingCart,
    accent: ACCENT_COLORS.amber,
    count: '3 guides',
  },
  {
    label: 'HRMS & Payroll',
    href: '/services/custom-hrms-payroll-software',
    summary: 'Attendance, payroll rules, approvals, payslips, branch policies, and workforce dashboards.',
    icon: UsersRound,
    accent: ACCENT_COLORS.violet,
    count: '3 guides',
  },
  {
    label: 'Custom Development',
    href: '/services/custom-business-systems',
    summary: 'Internal CRM, approval portals, workflow automation, SaaS-vs-custom decisions, and dashboards.',
    icon: Workflow,
    accent: ACCENT_COLORS.sky,
    count: '3 guides',
  },
];

const COUNTRY_LINKS = [
  { label: 'India', href: '/india' },
  { label: 'USA', href: '/usa' },
  { label: 'UAE', href: '/uae' },
  { label: 'Canada', href: '/canada' },
];

export default async function InsightsPage() {
  const dbStatuses = await listInsightSlugStatuses();
  const dbStatusBySlug = new Map(dbStatuses.map((item) => [item.slug, item.status]));
  const dbPosts = await Promise.all(
    dbStatuses
      .filter((item) => item.status === ContentStatus.PUBLISHED)
      .map((item) => getPublishedInsightBySlug(item.slug)),
  );
  const publishedPosts = dbPosts.flatMap((post) =>
    post
      ? [{
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      author: post.author,
      readingTime: `${Math.max(3, Math.ceil(post.body.split(/\s+/).length / 220))} min read`,
      category: post.niche.replaceAll('_', ' '),
      accentColor: 'teal',
    }]
      : [],
  );
  const posts = [...publishedPosts, ...insights.filter((post) => !dbStatusBySlug.has(post.slug))];

  return (
    <>
      <PageHero
        title="Engineering Insights"
        subtitle="We document our technical approaches to difficult problems in healthcare algorithms, mass inventory coordination, and HRMS data security."
        badge="Blog & Notes"
        accentColor="rose"
      />

      <section className="py-20 lg:py-28 relative z-10">
        <div className="max-w-[var(--max-w-content)] mx-auto px-6 lg:px-10">
          <div className="mb-14 border-b border-white/[0.06] pb-12">
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-teal">
                  Service Knowledge Clusters
                </p>
                <h2 className="font-[family-name:var(--font-outfit)] text-3xl font-bold tracking-tight text-white lg:text-4xl">
                  Research-backed software guides for the services CodingBull sells.
                </h2>
              </div>
              <p className="max-w-md text-sm font-light leading-relaxed text-white/50">
                Each cluster links the article library to one canonical service page and the country pages used for India, USA, UAE, and Canada search intent.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {INSIGHT_CLUSTERS.map((cluster) => {
                const Icon = cluster.icon;
                return (
                  <div
                    key={cluster.href}
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-colors duration-300 hover:border-white/10 hover:bg-white/[0.04]"
                  >
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${cluster.accent.border} ${cluster.accent.bg}`}>
                        <Icon className={`h-5 w-5 ${cluster.accent.text}`} strokeWidth={1.8} />
                      </div>
                      <span className="rounded-full border border-white/[0.06] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                        {cluster.count}
                      </span>
                    </div>
                    <h3 className="mb-3 font-[family-name:var(--font-outfit)] text-lg font-bold text-white">
                      {cluster.label}
                    </h3>
                    <p className="mb-5 text-sm font-light leading-relaxed text-white/50">
                      {cluster.summary}
                    </p>
                    <Link
                      href={cluster.href}
                      className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] ${cluster.accent.text} hover:text-white`}
                    >
                      Service page
                      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {COUNTRY_LINKS.map((country) => (
                <Link
                  key={country.href}
                  href={country.href}
                  className="group flex min-h-14 items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.015] px-4 text-sm font-medium text-white/70 transition-colors duration-300 hover:border-teal/30 hover:bg-teal/[0.04] hover:text-white"
                >
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-teal/70" strokeWidth={1.8} />
                    {country.label}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-white/30 transition-colors group-hover:text-teal" strokeWidth={2} />
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => {
              const accent = ACCENT_COLORS[post.accentColor] || ACCENT_COLORS.teal;
              return (
                <Link
                  key={post.slug}
                  href={`/insights/${post.slug}`}
                  className="group block rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500 overflow-hidden"
                >
                  {/* Category bar */}
                  <div className={`px-8 py-3 ${accent.bg} border-b ${accent.border}`}>
                    <span className={`text-[10px] font-bold uppercase tracking-[0.25em] ${accent.text}`}>
                      {post.category}
                    </span>
                  </div>

                  <div className="p-8">
                    <h2 className="text-xl lg:text-2xl font-bold font-[family-name:var(--font-outfit)] text-white mb-3 group-hover:text-teal transition-colors duration-300 tracking-tight">
                      {post.title}
                    </h2>
                    <p className="text-white/50 text-sm leading-relaxed mb-6 font-light line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-teal/10 border border-teal/20 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-teal">PD</span>
                        </div>
                        <div>
                          <p className="text-white/60 text-xs font-medium">{post.author}</p>
                          <p className="text-white/30 text-[10px]">{post.readingTime}</p>
                        </div>
                      </div>

                      <span className="text-teal/60 text-xs font-medium group-hover:text-teal transition-colors flex items-center gap-1.5">
                        Read
                        <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection cta={homeContent.finalCTA} />
    </>
  );
}
