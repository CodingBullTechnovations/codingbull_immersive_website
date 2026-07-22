import Link from 'next/link';
import { insights } from '@/content/insights';
import { Reveal } from '@/components/animations/Reveal';
import { getPublishedInsightBySlug, listInsightSlugStatuses } from '@/lib/server/public-content';
import { ContentStatus } from '@prisma/client';

interface NoteEntry {
  slug: string;
  title: string;
  date: string;
  readingTime: string;
}

/**
 * Compact, status-aware rail of the three latest publicly visible insights.
 * DB-first with static fallback for slugs the CMS does not own — the same
 * visibility merge as the insights index. Server-rendered links only.
 */
export async function EngineeringNotesRail() {
  const dbStatuses = await listInsightSlugStatuses();
  const dbStatusBySlug = new Map(dbStatuses.map((item) => [item.slug, item.status]));
  const dbPosts = await Promise.all(
    dbStatuses
      .filter((item) => item.status === ContentStatus.PUBLISHED)
      .map((item) => getPublishedInsightBySlug(item.slug)),
  );

  const publishedPosts: NoteEntry[] = dbPosts.flatMap((post) =>
    post
      ? [{
          slug: post.slug,
          title: post.title,
          date: (post.publishedAt ?? post.createdAt).toISOString().slice(0, 10),
          readingTime: `${Math.max(3, Math.ceil(post.body.split(/\s+/).length / 220))} min read`,
        }]
      : [],
  );
  const staticPosts: NoteEntry[] = insights
    .filter((post) => !dbStatusBySlug.has(post.slug))
    .map((post) => ({ slug: post.slug, title: post.title, date: post.date, readingTime: post.readingTime }));

  const notes = [...publishedPosts, ...staticPosts]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);
  if (notes.length === 0) return null;

  return (
    <section className="mind-section cb-section border-b border-white/[0.08]" aria-labelledby="notes-title">
      <div className="cb-shell">
        <Reveal className="flex flex-col gap-8 border-b border-white/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="cb-kicker">Engineering notes / 09</p>
            <h2 id="notes-title" className="cb-display mt-6 max-w-[14ch] text-[clamp(2rem,3.8vw,3.6rem)]">
              Operational writing from real delivery.
            </h2>
          </div>
          <Link
            href="/insights"
            className="cb-mono text-xs uppercase tracking-[0.16em] text-[var(--accent-soft)] transition-colors hover:text-white"
          >
            Read the blog <span aria-hidden="true">↗</span>
          </Link>
        </Reveal>

        <Reveal mode="group" className="divide-y divide-white/10">
          {notes.map((note, index) => (
            <Link
              key={note.slug}
              href={`/insights/${note.slug}`}
              data-reveal=""
              style={{ ['--reveal-delay' as string]: `${index * 0.07}s` }}
              className="group grid gap-3 py-7 sm:grid-cols-[4rem_1fr_auto] sm:items-center sm:gap-8"
            >
              <span className="cb-mono text-xs tracking-[0.18em] text-[var(--accent-soft)]">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="font-[family-name:var(--font-display)] text-lg font-medium tracking-[-0.02em] text-white/85 transition-colors group-hover:text-white sm:text-xl">
                {note.title}
              </h3>
              <span className="cb-mono text-xs uppercase tracking-[0.14em] text-white/40">
                {note.readingTime} <span aria-hidden="true">↗</span>
              </span>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
