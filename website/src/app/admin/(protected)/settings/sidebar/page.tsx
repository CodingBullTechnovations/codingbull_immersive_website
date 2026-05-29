import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { insights } from '@/content/insights';
import { listInsightPostsAdmin } from '@/lib/server/cms';
import { getInsightSidebarStore } from '@/lib/server/sidebar-config';
import { SidebarConfigForm } from '@/app/admin/(protected)/settings/sidebar/SidebarConfigForm';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminSidebarConfigPage({ searchParams }: { searchParams?: SearchParams }) {
  const [store, posts, params] = await Promise.all([
    getInsightSidebarStore(),
    listInsightPostsAdmin(),
    searchParams ?? Promise.resolve({} as Record<string, string | string[] | undefined>),
  ]);

  const slugs = Array.from(new Set([
    ...posts.map((post) => post.slug),
    ...insights.map((post) => post.slug),
  ])).sort();

  const notice = firstParam(params.notice);
  const reason = firstParam(params.reason);

  return (
    <>
      <AdminPageHeader
        title="Insight Sidebar Config"
        description="Control sidebar presets, default behavior, and per-insight overrides for HUD telemetry, architecture specs, and share links. Changes take effect at runtime without a rebuild."
      />

      {notice === 'saved' && (
        <section className="mb-6 rounded-xl border border-teal/25 bg-teal/10 p-4 text-teal">
          <p className="text-sm font-semibold">Configuration saved</p>
          <p className="mt-1 text-sm opacity-80">
            The sidebar config has been updated. Changes will appear on the next Insight page visit after revalidation.
          </p>
        </section>
      )}

      {notice === 'invalid' && (
        <section className="mb-6 rounded-xl border border-amber-300/25 bg-amber-300/10 p-4 text-amber-100">
          <p className="text-sm font-semibold">Configuration not saved</p>
          <p className="mt-1 text-sm opacity-80">{reason || 'The submitted config did not pass validation.'}</p>
        </section>
      )}

      <SidebarConfigForm initialStore={store} insightSlugs={slugs} />
    </>
  );
}
