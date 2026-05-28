import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/PageHero';
import { CTASection } from '@/components/sections/CTASection';
import { homeContent } from '@/content/home';
import { insights, insightsBySlug, type InsightPost } from '@/content/insights';
import { siteConfig } from '@/content/site';
import { generatePageMetadata } from '@/lib/seo';
import { JsonLd, generateArticleSchema, generateBreadcrumbSchema } from '@/lib/schema';
import { getInsightBySlug, listInsightSlugStatuses } from '@/lib/server/public-content';
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

function renderInlineStrong(text: string) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    return part;
  });
}

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
  const dbPost = await getInsightBySlug(slug);
  const post = dbPost
    ? (dbPost.status === ContentStatus.PUBLISHED ? mapDbPost(dbPost) : null)
    : insightsBySlug[slug];

  if (!post) {
    notFound();
  }

  const postUrl = `${siteConfig.baseUrl}/insights/${post.slug}`;

  return (
    <>
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

      <article className="py-16 lg:py-24 relative z-10">
        <div className="max-w-3xl mx-auto px-6">
          {/* Meta info */}
          <div className="flex items-center gap-4 mb-12 pb-8 border-b border-white/[0.05]">
            <div className="w-12 h-12 rounded-full bg-teal/10 border border-teal/20 flex items-center justify-center">
              <span className="text-sm font-bold text-teal">PD</span>
            </div>
            <div>
              <p className="text-white/80 text-sm font-medium">{post.author}</p>
              <p className="text-white/30 text-xs">{post.date} · {post.readingTime}</p>
            </div>
          </div>

          {/* Article content */}
          <div className="prose prose-invert prose-lg max-w-none
            prose-headings:font-[family-name:var(--font-outfit)] prose-headings:tracking-tight
            prose-h2:text-2xl prose-h2:lg:text-3xl prose-h2:font-bold prose-h2:text-white prose-h2:mt-12 prose-h2:mb-6
            prose-h3:text-xl prose-h3:font-semibold prose-h3:text-white/90 prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-white/60 prose-p:leading-relaxed prose-p:font-light prose-p:mb-6
            prose-li:text-white/60 prose-li:font-light
            prose-strong:text-white prose-strong:font-semibold
            prose-code:text-teal prose-code:bg-teal/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-pre:bg-white/[0.03] prose-pre:border prose-pre:border-white/[0.08] prose-pre:rounded-xl
            prose-a:text-teal prose-a:no-underline hover:prose-a:underline
            prose-ul:my-4 prose-ol:my-4
          ">
            {post.content.split('\n').map((line, idx) => {
              const trimmed = line.trim();
              if (!trimmed) return null;

              if (trimmed.startsWith('## ')) {
                return <h2 key={idx}>{trimmed.replace('## ', '')}</h2>;
              }
              if (trimmed.startsWith('### ')) {
                return <h3 key={idx}>{trimmed.replace('### ', '')}</h3>;
              }
              if (trimmed.startsWith('```')) {
                return null; // Skip code fences for now
              }
              if (trimmed.startsWith('- ')) {
                return (
                  <div key={idx} className="flex items-start gap-3 mb-2">
                    <span className="text-teal mt-1.5 shrink-0">•</span>
                    <span className="text-white/60 font-light">{trimmed.replace('- ', '')}</span>
                  </div>
                );
              }
              if (trimmed.startsWith('1. ') || trimmed.startsWith('2. ') || trimmed.startsWith('3. ')) {
                const num = trimmed.charAt(0);
                return (
                  <div key={idx} className="flex items-start gap-3 mb-2">
                    <span className="text-teal font-bold shrink-0">{num}.</span>
                    <span className="text-white/60 font-light">{trimmed.slice(3)}</span>
                  </div>
                );
              }
              return <p key={idx}>{renderInlineStrong(trimmed)}</p>;
            })}
          </div>

          {/* Back link */}
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
        </div>
      </article>

      <CTASection cta={homeContent.finalCTA} />
    </>
  );
}
