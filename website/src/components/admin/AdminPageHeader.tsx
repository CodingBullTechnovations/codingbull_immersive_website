export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-teal">Admin</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white font-[family-name:var(--font-outfit)] lg:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">{description}</p>
      </div>
      {action}
    </div>
  );
}
