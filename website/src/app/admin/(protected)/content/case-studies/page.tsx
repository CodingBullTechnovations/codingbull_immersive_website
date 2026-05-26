import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { listCaseStudiesAdmin } from '@/lib/server/cms';

export default async function AdminCaseStudiesPage() {
  const studies = await listCaseStudiesAdmin();

  return (
    <>
      <AdminPageHeader
        title="Case Studies"
        description="Maintain permission-safe proof assets with problems, constraints, architecture, outcomes, and metrics."
        action={<Link href="/admin/content/case-studies/new" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-black hover:bg-primary-hover">New case study</Link>}
      />

      <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
        {studies.length === 0 ? (
          <p className="px-5 py-10 text-sm text-white/45">No case studies yet.</p>
        ) : (
          <div className="divide-y divide-white/10">
            {studies.map((study) => (
              <Link key={study.id} href={`/admin/content/case-studies/${study.id}`} className="grid gap-3 px-5 py-4 hover:bg-white/[0.03] lg:grid-cols-[1fr_auto_auto] lg:items-center">
                <div>
                  <p className="font-semibold text-white">{study.client}</p>
                  <p className="mt-1 text-xs text-white/40">{study.title}</p>
                </div>
                <span className="text-xs text-white/45">{study.permissionStatus}</span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] text-white/45">{study.status}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
