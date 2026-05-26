export const adminInputClass =
  'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-teal/50';

export const adminSelectClass =
  'w-full rounded-xl border border-white/10 bg-[#101522] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-teal/50';

export function AdminField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">{label}</span>
      {children}
      {hint && <span className="block text-xs leading-5 text-white/35">{hint}</span>}
    </label>
  );
}

export function AdminSubmitButton({ label = 'Save changes' }: { label?: string }) {
  return (
    <button className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-primary-hover">
      {label}
    </button>
  );
}
