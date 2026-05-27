import Link from 'next/link';
import { ContentStatus } from '@prisma/client';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { listInsightPostsAdmin } from '@/lib/server/cms';
import { archiveContentAction, restoreContentAction } from '../actions';

export default async function AdminInsightsPage() {
  const posts = await listInsightPostsAdmin();

  return (
    <>
      <AdminPageHeader
        title="Insights"
        description="Publish original engineering posts for healthcare, e-commerce, HRMS, and custom systems authority."
        action={<Link href="/admin/content/insights/new" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-black hover:bg-primary-hover">New insight</Link>}
      />

      <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
        {posts.length === 0 ? (
          <p className="px-5 py-10 text-sm text-white/45">No insight posts yet.</p>
        ) : (
          <div className="divide-y divide-white/10">
            {posts.map((post) => (
              <div key={post.id} className="grid gap-3 px-5 py-4 hover:bg-white/[0.03] lg:grid-cols-[1fr_auto_auto_auto] lg:items-center">
                <div>
                  <Link href={`/admin/content/insights/${post.id}`} className="font-semibold text-white hover:text-teal">{post.title}</Link>
                  <p className="mt-1 text-xs text-white/40">/insights/{post.slug}</p>
                </div>
                <span className="text-xs text-white/45">{post.niche}</span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] text-white/45">{post.status}</span>
                <ContentLifecycleForm entityType="InsightPost" id={post.id} archived={post.status === ContentStatus.ARCHIVED} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function ContentLifecycleForm({ entityType, id, archived }: { entityType: string; id: string; archived: boolean }) {
  return archived ? (
    <form action={restoreContentAction} className="flex justify-end">
      <input type="hidden" name="entityType" value={entityType} />
      <input type="hidden" name="id" value={id} />
      <button className="rounded-lg border border-teal/25 px-3 py-2 text-xs font-semibold text-teal hover:bg-teal/10">Restore draft</button>
    </form>
  ) : (
    <form action={archiveContentAction} className="flex gap-2">
      <input type="hidden" name="entityType" value={entityType} />
      <input type="hidden" name="id" value={id} />
      <input name="confirmation" placeholder="ARCHIVE" className="w-24 rounded-lg border border-white/10 bg-black/20 px-2 py-2 text-xs text-white outline-none placeholder:text-white/25" />
      <button className="rounded-lg border border-amber-300/25 px-3 py-2 text-xs font-semibold text-amber-100 hover:bg-amber-300/10">Archive</button>
    </form>
  );
}
