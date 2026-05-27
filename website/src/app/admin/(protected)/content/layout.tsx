import Link from 'next/link';
import { getContentOwnershipSummary } from '@/lib/server/content-ownership';

export default function AdminContentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ownership = getContentOwnershipSummary();

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
      <div>{children}</div>

      <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-semibold text-white">Content ownership matrix</h2>
          <p className="mt-2 text-xs leading-5 text-white/45">
            This panel explains which pages are editable from admin and which pages still require a code update.
          </p>
          <dl className="mt-4 space-y-2 text-xs">
            <div className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2">
              <dt className="text-white/55">DB controlled</dt>
              <dd className="font-semibold text-white">{ownership.dbControlled}</dd>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2">
              <dt className="text-white/55">Mixed DB + static</dt>
              <dd className="font-semibold text-white">{ownership.mixed}</dd>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2">
              <dt className="text-white/55">Code managed only</dt>
              <dd className="font-semibold text-white">{ownership.staticCode}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="text-sm font-semibold text-white">Pages not controlled from admin</h3>
          <p className="mt-2 text-xs leading-5 text-white/45">
            These public pages need a code change. Use this list when creating a request for the engineering team.
          </p>
          <ul className="mt-4 space-y-2">
            {ownership.notAdminControlled.map((item) => (
              <li key={item.route} className="rounded-lg border border-white/10 px-3 py-2">
                <Link href={item.route} className="text-sm font-medium text-teal hover:text-primary-hover">
                  {item.route}
                </Link>
                <p className="mt-1 text-[11px] leading-4 text-white/45">{item.label}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">Employee guide</p>
          <p className="mt-2 text-xs leading-5 text-white/45">
            Read <code className="text-white">/website/docs/CONTENT_CONTROL_MATRIX.md</code> for a plain-language edit guide.
          </p>
        </section>
      </aside>
    </div>
  );
}
