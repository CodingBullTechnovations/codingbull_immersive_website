export function AdminStat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">{label}</p>
      <p className="mt-3 text-3xl font-bold text-white">{value}</p>
      {detail && <p className="mt-2 text-xs text-white/40">{detail}</p>}
    </div>
  );
}
