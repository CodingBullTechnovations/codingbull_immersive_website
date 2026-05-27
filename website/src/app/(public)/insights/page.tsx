import Link from 'next/link';
import { PageHero } from '@/components/sections/PageHero';
import { CTASection } from '@/components/sections/CTASection';
import { homeContent } from '@/content/home';
import { insights } from '@/content/insights';
import { pageMetadata, generatePageMetadata } from '@/lib/seo';
import { getPublishedInsightBySlug, listPublishedInsightSlugs } from '@/lib/server/public-content';

export const metadata = generatePageMetadata(pageMetadata.insights);

const ACCENT_COLORS: Record<string, { border: string; bg: string; text: string }> = {
  teal: { border: 'border-teal/20', bg: 'bg-teal/[0.05]', text: 'text-teal' },
  amber: { border: 'border-amber-400/20', bg: 'bg-amber-400/[0.05]', text: 'text-amber-400' },
  violet: { border: 'border-violet-400/20', bg: 'bg-violet-400/[0.05]', text: 'text-violet-400' },
  sky: { border: 'border-sky-400/20', bg: 'bg-sky-400/[0.05]', text: 'text-sky-400' },
  rose: { border: 'border-rose-400/20', bg: 'bg-rose-400/[0.05]', text: 'text-rose-400' },
};

export default async function InsightsPage() {
  const dbSlugs = await listPublishedInsightSlugs();
  const dbPosts = await Promise.all(dbSlugs.map((item) => getPublishedInsightBySlug(item.slug)));
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
  const posts = [...publishedPosts, ...insights.filter((post) => !publishedPosts.some((dbPost) => dbPost.slug === post.slug))];

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
