'use client';

import { useFormStatus } from 'react-dom';

export function SyncSubmitButton({
  label,
  pendingLabel,
  ready,
  reason,
}: {
  label: string;
  pendingLabel: string;
  ready: boolean;
  reason: string;
}) {
  const { pending } = useFormStatus();
  const disabled = !ready || pending;
  const disabledReason = ready ? 'Sync request is running' : reason;

  return (
    <button
      aria-label={disabled ? `${label}: ${disabledReason}` : label}
      className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
        disabled
          ? 'cursor-not-allowed border-white/5 bg-white/[0.02] text-white/35'
          : 'border-teal/40 bg-teal/15 text-teal hover:bg-teal/25'
      }`}
      disabled={disabled}
      title={disabled ? disabledReason : label}
      type="submit"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}
