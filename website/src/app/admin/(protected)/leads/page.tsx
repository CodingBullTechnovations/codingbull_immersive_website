import Link from 'next/link';
import { LeadStatus } from '@prisma/client';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { listLeads } from '@/lib/server/leads';
import { updateLeadStatusAction } from './actions';

const statusLabels: Record<LeadStatus, string> = {
  NEW: 'New',
  QUALIFIED: 'Qualified',
  CONTACTED: 'Contacted',
  PROPOSAL_SENT: 'Proposal Sent',
  WON: 'Won',
  LOST: 'Lost',
  SPAM: 'Spam',
};

export default async function AdminLeadsPage() {
  const leads = await listLeads();

  return (
    <>
      <AdminPageHeader
        title="Leads"
        description="Qualified inquiry pipeline from the public website, WhatsApp CTAs, and local first-party conversion events."
      />

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        <div className="hidden grid-cols-[1.2fr_1fr_0.8fr_0.8fr_0.8fr] gap-4 border-b border-white/10 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35 lg:grid">
          <span>Lead</span>
          <span>Interest</span>
          <span>Score</span>
          <span>Status</span>
          <span>Created</span>
        </div>

        {leads.length === 0 ? (
          <p className="px-5 py-10 text-sm text-white/45">No leads captured yet.</p>
        ) : (
          <div className="divide-y divide-white/10">
            {leads.map((lead) => (
              <div key={lead.id} className="grid gap-4 px-5 py-5 lg:grid-cols-[1.2fr_1fr_0.8fr_0.8fr_0.8fr] lg:items-center">
                <Link href={`/admin/leads/${lead.id}`} className="block">
                  <p className="font-semibold text-white">{lead.name}</p>
                  <p className="mt-1 text-xs text-white/45">{lead.company || lead.email}</p>
                </Link>
                <p className="text-sm text-white/60">{lead.serviceInterest}</p>
                <p className="text-sm text-teal">{lead.score}/100</p>
                <form action={updateLeadStatusAction}>
                  <input type="hidden" name="leadId" value={lead.id} />
                  <select
                    name="status"
                    defaultValue={lead.status}
                    className="w-full rounded-xl border border-white/10 bg-[#101522] px-3 py-2 text-xs text-white"
                    aria-label={`Status for ${lead.name}`}
                  >
                    {Object.values(LeadStatus).map((status) => (
                      <option key={status} value={status}>
                        {statusLabels[status]}
                      </option>
                    ))}
                  </select>
                  <button className="mt-2 w-full rounded-lg border border-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-white/45 hover:text-white">
                    Save
                  </button>
                </form>
                <p className="text-xs text-white/40">{lead.createdAt.toLocaleDateString('en-IN')}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
