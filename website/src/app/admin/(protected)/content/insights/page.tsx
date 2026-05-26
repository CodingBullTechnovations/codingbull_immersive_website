import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { listInsightPostsAdmin } from '@/lib/server/cms';

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
              <Link key={post.id} href={`/admin/content/insights/${post.id}`} className="grid gap-3 px-5 py-4 hover:bg-white/[0.03] lg:grid-cols-[1fr_auto_auto] lg:items-center">
                <div>
                  <p className="font-semibold text-white">{post.title}</p>
                  <p className="mt-1 text-xs text-white/40">/insights/{post.slug}</p>
                </div>
                <span className="text-xs text-white/45">{post.niche}</span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] text-white/45">{post.status}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
