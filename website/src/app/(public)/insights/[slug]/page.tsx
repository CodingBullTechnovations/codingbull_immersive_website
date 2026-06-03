import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowUpRight, BookOpenCheck, Globe2 } from 'lucide-react';
import { PageHero } from '@/components/sections/PageHero';
import { CTASection } from '@/components/sections/CTASection';
import { InsightSidebar } from '@/components/sections/InsightSidebar';
import { MarkdownContent, generateHeadingId, parseMarkdownToBlocks } from '@/components/sections/MarkdownContent';
import { ReadingProgressBar } from '@/components/sections/ReadingProgressBar';
import { homeContent } from '@/content/home';
import { insights, insightsBySlug, type InsightPost } from '@/content/insights';
import { siteConfig } from '@/content/site';
import { generatePageMetadata } from '@/lib/seo';
import { JsonLd, generateArticleSchema, generateBreadcrumbSchema } from '@/lib/schema';
import { getInsightBySlug, listInsightSlugStatuses } from '@/lib/server/public-content';
import { getInsightSidebarConfigForSlug } from '@/lib/server/sidebar-config';
import { ContentStatus } from '@prisma/client';

export async function generateStaticParams() {
  const dbPosts = await listInsightSlugStatuses();
  const dbStatusBySlug = new Map(dbPosts.map((item) => [item.slug, item.status]));
  const slugs = new Set([
    ...dbPosts.filter((item) => item.status === ContentStatus.PUBLISHED).map((item) => item.slug),
    ...insights.filter((item) => !dbStatusBySlug.has(item.slug)).map((item) => item.slug),
  ]);
  return Array.from(slugs).map((slug) => ({ slug }));
}

function mapDbPost(post: Awaited<ReturnType<typeof getInsightBySlug>>): InsightPost | null {
  if (!post) return null;

  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.body,
    author: post.author,
    date: (post.publishedAt ?? post.createdAt).toISOString().slice(0, 10),
    readingTime: `${Math.max(3, Math.ceil(post.body.split(/\s+/).length / 220))} min read`,
    category: post.niche.replaceAll('_', ' '),
    accentColor: 'teal',
  };
}

function getPrimaryService(post: InsightPost) {
  const key = `${post.category} ${post.title}`.toLowerCase();
  if (key.includes('healthcare') || key.includes('clinic') || key.includes('patient') || key.includes('django')) {
    return {
      label: 'Healthcare Software Development',
      href: '/services/healthcare-software-development',
      summary: 'Clinic systems, patient records, appointment workflows, and medical software backends.',
    };
  }
  if (key.includes('e-commerce') || key.includes('shopify') || key.includes('inventory')) {
    return {
      label: 'E-commerce Development',
      href: '/services/ecommerce-development',
      summary: 'SEO-first storefronts, inventory automation, order workflows, and B2B commerce systems.',
    };
  }
  if (key.includes('hrms') || key.includes('payroll') || key.includes('attendance')) {
    return {
      label: 'HRMS & Payroll Software',
      href: '/services/custom-hrms-payroll-software',
      summary: 'Attendance, payroll rules, approvals, payslips, and workforce dashboards.',
    };
  }
  return {
    label: 'Custom Business Systems',
    href: '/services/custom-business-systems',
    summary: 'Internal CRM, workflow automation, approval portals, dashboards, and custom software.',
  };
}

const COUNTRY_LINKS = [
  { label: 'India', href: '/india' },
  { label: 'USA', href: '/usa' },
  { label: 'UAE', href: '/uae' },
  { label: 'Canada', href: '/canada' },
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const dbPost = await getInsightBySlug(slug);
  const post = dbPost
    ? (dbPost.status === ContentStatus.PUBLISHED ? mapDbPost(dbPost) : null)
    : insightsBySlug[slug];
  if (!post) return { title: 'Post Not Found' };

  return generatePageMetadata({
    title: post.title,
    description: post.excerpt,
    canonical: `${siteConfig.baseUrl}/insights/${slug}`,
  });
}

export default async function InsightPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [dbPost, sidebarConfig] = await Promise.all([
    getInsightBySlug(slug),
    getInsightSidebarConfigForSlug(slug),
  ]);
  const post = dbPost
    ? (dbPost.status === ContentStatus.PUBLISHED ? mapDbPost(dbPost) : null)
    : insightsBySlug[slug];

  if (!post) {
    notFound();
  }

  const postUrl = `${siteConfig.baseUrl}/insights/${post.slug}`;
  const blocks = parseMarkdownToBlocks(post.content);
  const headings = blocks
    .filter((b) => b.type === 'h2')
    .map((b) => ({
      text: b.text || '',
      id: generateHeadingId(b.text || ''),
    }));
  const primaryService = getPrimaryService(post);
  const briefHeadings = headings.slice(0, 5);

  // Fetch all posts to determine related posts
  const dbStatuses = await listInsightSlugStatuses();
  const dbStatusBySlug = new Map(dbStatuses.map((item) => [item.slug, item.status]));
  const publishedDbPosts = await Promise.all(
    dbStatuses
      .filter((item) => item.status === ContentStatus.PUBLISHED)
      .map((item) => getInsightBySlug(item.slug))
  );
  const mappedDbPosts = publishedDbPosts.flatMap((post) => post ? [mapDbPost(post)!] : []);
  const staticPosts = insights.filter((post) => !dbStatusBySlug.has(post.slug));
  const allPosts = [...mappedDbPosts, ...staticPosts];

  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => {
      if (a.category === post.category && b.category !== post.category) return -1;
      if (a.category !== post.category && b.category === post.category) return 1;
      return 0;
    })
    .slice(0, 2);

  return (
    <>
      <ReadingProgressBar />
      <JsonLd data={generateArticleSchema({
        title: post.title,
        description: post.excerpt,
        url: postUrl,
        datePublished: post.date,
        author: post.author,
      })} />
      <JsonLd data={generateBreadcrumbSchema([
        { name: 'Home', url: siteConfig.baseUrl },
        { name: 'Insights', url: `${siteConfig.baseUrl}/insights` },
        { name: post.title, url: postUrl },
      ])} />

      <PageHero
        title={post.title}
        subtitle={post.excerpt}
        badge={post.category}
        accentColor={post.accentColor}
      />

      <section className="py-20 lg:py-28 relative z-10 overflow-hidden bg-[#050508]">
        {/* Shifting radial ambient glows in background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal/[0.02] rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/3 w-[800px] h-[800px] bg-white/[0.01] rounded-full blur-[180px] pointer-events-none" />

        <div className="max-w-[var(--max-w-wide)] mx-auto px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start justify-between">
            
            {/* Main Article column */}
            <article className="flex-1 max-w-3xl w-full">
              
              {/* Meta details header (Mobile only, hidden on desktop) */}
              <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/[0.05] lg:hidden">
                <div className="w-12 h-12 rounded-full bg-teal/10 border border-teal/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-teal">PD</span>
                </div>
                <div>
                  <p className="text-white/80 text-sm font-medium">{post.author}</p>
                  <p className="text-white/35 text-xs">{post.date} · {post.readingTime}</p>
                </div>
              </div>

              <div className="mb-12 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-6 lg:p-7">
                <div className="grid gap-7 lg:grid-cols-[1.2fr_0.8fr]">
                  <div>
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal/20 bg-teal/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-teal">
                      <BookOpenCheck className="h-3.5 w-3.5" strokeWidth={2} />
                      Decision Brief
                    </div>
                    <p className="mb-5 text-sm font-light leading-relaxed text-white/60 md:text-base">
                      {post.excerpt}
                    </p>
                    {briefHeadings.length > 0 && (
                      <div className="grid gap-2">
                        {briefHeadings.map((heading) => (
                          <a
                            key={heading.id}
                            href={`#${heading.id}`}
                            className="group flex items-center justify-between rounded-lg border border-white/[0.04] bg-black/20 px-4 py-3 text-sm text-white/65 transition-colors hover:border-teal/20 hover:bg-teal/[0.035] hover:text-white"
                          >
                            <span>{heading.text}</span>
                            <ArrowUpRight className="h-3.5 w-3.5 text-white/25 transition-colors group-hover:text-teal" strokeWidth={2} />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rounded-xl border border-white/[0.05] bg-black/20 p-5">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">
                      Related Service
                    </p>
                    <Link
                      href={primaryService.href}
                      className="group mb-5 block rounded-lg border border-white/[0.05] bg-white/[0.02] p-4 transition-colors hover:border-teal/25 hover:bg-teal/[0.035]"
                    >
                      <span className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-white">
                        {primaryService.label}
                        <ArrowUpRight className="h-4 w-4 text-teal/70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
                      </span>
                      <span className="block text-xs font-light leading-relaxed text-white/45">
                        {primaryService.summary}
                      </span>
                    </Link>

                    <p className="mb-3 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">
                      <Globe2 className="h-3.5 w-3.5 text-teal/60" strokeWidth={2} />
                      Country Coverage
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {COUNTRY_LINKS.map((country) => (
                        <Link
                          key={country.href}
                          href={country.href}
                          className="rounded-lg border border-white/[0.05] bg-white/[0.015] px-3 py-2 text-xs font-medium text-white/55 transition-colors hover:border-teal/20 hover:bg-teal/[0.035] hover:text-white"
                        >
                          {country.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Content Renderer */}
              <MarkdownContent blocks={blocks} />

              {/* Author Bio Card */}
              <div className="mt-20 p-8 rounded-2xl border border-white/[0.04] bg-white/[0.01] backdrop-blur-xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[radial-gradient(ellipse_at_bottom_right,rgba(20,184,166,0.06),transparent_70%)] pointer-events-none" />
                <div className="w-16 h-16 rounded-full bg-teal/10 border border-teal/20 flex items-center justify-center shrink-0">
                  <span className="text-xl font-bold text-teal">PD</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1 font-[family-name:var(--font-outfit)]">
                    {post.author}
                  </h4>
                  <p className="text-[10px] text-teal font-mono uppercase tracking-widest mb-3">
                    Founder & Chief Architect
                  </p>
                  <p className="text-sm text-white/50 leading-relaxed font-light">
                    Architecting high-scale healthcare backends, SEO-first custom e-commerce engines, and high-performance business process automation systems at CodingBull.
                  </p>
                </div>
              </div>

              {/* Related Insights Grid */}
              {relatedPosts.length > 0 && (
                <div className="mt-20 pt-10 border-t border-white/[0.05]">
                  <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-white/40 mb-8">
                    Related Insights
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {relatedPosts.map((related) => (
                      <Link
                        key={related.slug}
                        href={`/insights/${related.slug}`}
                        className="group block p-6 rounded-xl border border-white/[0.04] bg-white/[0.015] hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300"
                      >
                        <span className="text-[9px] font-bold text-teal uppercase tracking-widest block mb-2 font-mono">
                          {related.category}
                        </span>
                        <h4 className="text-base font-bold text-white mb-2 group-hover:text-teal transition-colors line-clamp-2 font-[family-name:var(--font-outfit)]">
                          {related.title}
                        </h4>
                        <p className="text-white/45 text-xs font-light line-clamp-2 leading-relaxed">
                          {related.excerpt}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Back to index link */}
              <div className="mt-16 pt-8 border-t border-white/[0.05]">
                <Link
                  href="/insights"
                  className="inline-flex items-center gap-2 text-teal/60 hover:text-teal text-sm font-medium transition-colors"
                >
                  <svg className="w-4 h-4 rotate-180" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                  Back to Insights
                </Link>
              </div>

            </article>

            {/* Desktop Sticky Sidebar */}
            <InsightSidebar 
              headings={headings}
              author={post.author}
              date={post.date}
              readingTime={post.readingTime}
              slug={post.slug}
              title={post.title}
              config={sidebarConfig}
            />

          </div>
        </div>
      </section>

      <CTASection cta={homeContent.finalCTA} />
    </>
  );
}
