import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/PageHero';
import { CTASection } from '@/components/sections/CTASection';
import { CodeBlock } from '@/components/sections/CodeBlock';
import { InsightSidebar } from '@/components/sections/InsightSidebar';
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

function renderInlineStrong(text: string) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

interface ContentBlock {
  type: 'paragraph' | 'h2' | 'h3' | 'list' | 'code' | 'blockquote';
  items?: string[];
  lang?: string;
  text?: string;
}

function parseMarkdownToBlocks(content: string): ContentBlock[] {
  const lines = content.split('\n');
  const blocks: ContentBlock[] = [];
  let currentCodeBlock: { lang: string; lines: string[] } | null = null;
  let currentListBlock: { items: string[] } | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Handle code block toggle first
    if (trimmed.startsWith('```')) {
      if (currentListBlock) {
        blocks.push({ type: 'list', items: currentListBlock.items });
        currentListBlock = null;
      }
      if (currentCodeBlock) {
        blocks.push({
          type: 'code',
          lang: currentCodeBlock.lang,
          text: currentCodeBlock.lines.join('\n'),
        });
        currentCodeBlock = null;
      } else {
        const lang = trimmed.slice(3).trim() || 'typescript';
        currentCodeBlock = { lang, lines: [] };
      }
      continue;
    }

    if (currentCodeBlock) {
      currentCodeBlock.lines.push(line);
      continue;
    }

    // 2. Skip empty lines during general parsing, but DO NOT close the active list block
    if (!trimmed) {
      continue;
    }

    // 3. Handle list items (non-empty line)
    if (trimmed.startsWith('- ') || trimmed.match(/^\d+\.\s/)) {
      if (!currentListBlock) {
        currentListBlock = { items: [] };
      }
      currentListBlock.items.push(trimmed);
      continue;
    } else {
      if (currentListBlock) {
        blocks.push({ type: 'list', items: currentListBlock.items });
        currentListBlock = null;
      }
    }

    // 4. Handle other block elements
    if (trimmed.startsWith('## ')) {
      blocks.push({ type: 'h2', text: trimmed.slice(3) });
    } else if (trimmed.startsWith('### ')) {
      blocks.push({ type: 'h3', text: trimmed.slice(4) });
    } else if (trimmed.startsWith('> ')) {
      blocks.push({ type: 'blockquote', text: trimmed.slice(2) });
    } else {
      blocks.push({ type: 'paragraph', text: trimmed });
    }
  }

  if (currentListBlock) {
    blocks.push({ type: 'list', items: currentListBlock.items });
  }
  if (currentCodeBlock) {
    blocks.push({
      type: 'code',
      lang: currentCodeBlock.lang,
      text: currentCodeBlock.lines.join('\n'),
    });
  }

  return blocks;
}

function generateHeadingId(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
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

              {/* Dynamic Content Renderer */}
              <div className="prose prose-invert prose-lg max-w-none 
                prose-headings:font-[family-name:var(--font-outfit)] prose-headings:tracking-tight
                prose-p:text-white/70 prose-p:leading-relaxed prose-p:font-light prose-p:mb-6 prose-p:text-base md:prose-p:text-lg
                prose-strong:text-white prose-strong:font-semibold
                prose-code:text-teal prose-code:bg-teal/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                prose-a:text-teal prose-a:no-underline hover:prose-a:underline
              ">
                {blocks.map((block, idx) => {
                  switch (block.type) {
                    case 'h2': {
                      const headingId = generateHeadingId(block.text || '');
                      return (
                        <h2 
                          key={idx} 
                          id={headingId} 
                          className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-outfit)] text-white mt-12 mb-6 scroll-mt-24 flex items-center gap-2 group/heading"
                        >
                          <span className="text-teal font-mono text-lg opacity-0 group-hover/heading:opacity-60 transition-opacity">#</span>
                          {renderInlineStrong(block.text || '')}
                        </h2>
                      );
                    }
                    case 'h3':
                      return (
                        <h3 key={idx} className="text-xl font-semibold text-white/95 mt-8 mb-4">
                          {renderInlineStrong(block.text || '')}
                        </h3>
                      );
                    case 'blockquote':
                      return (
                        <blockquote key={idx} className="border-l-2 border-teal bg-teal/[0.02] px-6 py-4 rounded-r-xl my-8 text-white/85 italic font-light">
                          {renderInlineStrong(block.text || '')}
                        </blockquote>
                      );
                    case 'list':
                      return (
                        <ul key={idx} className="space-y-3 my-6 pl-2">
                          {block.items?.map((item, itemIdx) => {
                            const isOrdered = item.match(/^\d+\.\s/);
                            const textOnly = isOrdered ? item.replace(/^\d+\.\s/, '') : item.replace(/^- \s*/, '');
                            return (
                              <li key={itemIdx} className="flex items-start gap-3">
                                {isOrdered ? (
                                  <span className="text-teal font-mono font-bold shrink-0 mt-0.5">{item.match(/^\d+/)?.[0]}.</span>
                                ) : (
                                  <span className="text-teal shrink-0 mt-2.5 text-[10px]">•</span>
                                )}
                                <span className="text-white/70 font-light leading-relaxed">{renderInlineStrong(textOnly)}</span>
                              </li>
                            );
                          })}
                        </ul>
                      );
                    case 'code':
                      return (
                        <CodeBlock 
                          key={idx} 
                          code={block.text || ''} 
                          language={block.lang || 'typescript'} 
                        />
                      );
                    case 'paragraph':
                    default: {
                      const isLead = idx === 0 || (idx === 1 && blocks[0].type !== 'paragraph');
                      return (
                        <p 
                          key={idx} 
                          className={`text-white/70 leading-relaxed font-light mb-6 ${
                            isLead ? 'text-lg md:text-xl text-white/90 font-normal border-l-2 border-white/10 pl-4' : 'text-base md:text-lg'
                          }`}
                        >
                          {renderInlineStrong(block.text || '')}
                        </p>
                      );
                    }
                  }
                })}
              </div>

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
