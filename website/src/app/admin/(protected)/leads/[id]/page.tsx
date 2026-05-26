import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LeadStatus } from '@prisma/client';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { getLead } from '@/lib/server/leads';
import { addLeadNoteAction, updateLeadStatusAction } from '../actions';

function getWhatsAppHref(phone: string, name: string) {
  const digits = phone.replace(/\D/g, '');
  const message = encodeURIComponent(`Hi ${name}, this is CodingBull. I received your software inquiry and would like to discuss the scope.`);
  return `https://wa.me/${digits}?text=${message}`;
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) notFound();

  return (
    <>
      <AdminPageHeader
        title={lead.name}
        description={`${lead.serviceInterest} inquiry scored ${lead.score}/100 from ${lead.sourcePage || 'unknown page'}.`}
        action={
          <Link href="/admin/leads" className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/60 hover:text-white">
            Back to leads
          </Link>
        }
      />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="font-semibold text-white">Inquiry</h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-6 text-white/60">{lead.message}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="font-semibold text-white">Activity</h2>
            <div className="mt-5 space-y-4">
              {lead.activities.map((activity) => (
                <div key={activity.id} className="border-l border-teal/30 pl-4">
                  <p className="text-sm text-white">{activity.title}</p>
                  {activity.detail && <p className="mt-1 text-xs text-white/45">{activity.detail}</p>}
                  <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/25">
                    {activity.createdAt.toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="font-semibold text-white">Internal notes</h2>
            <form action={addLeadNoteAction} className="mt-5 space-y-3">
              <input type="hidden" name="leadId" value={lead.id} />
              <textarea
                name="body"
                required
                rows={4}
                placeholder="Add next step, call notes, objections, or proposal context."
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-teal/50"
              />
              <button className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-black hover:bg-primary-hover">
                Add note
              </button>
            </form>
            <div className="mt-6 space-y-4">
              {lead.notes.map((note) => (
                <div key={note.id} className="rounded-xl border border-white/10 bg-black/10 p-4">
                  <p className="text-sm text-white/65">{note.body}</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-white/25">
                    {note.author?.name || note.author?.email || 'Admin'} · {note.createdAt.toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="font-semibold text-white">Lead controls</h2>
            <form action={updateLeadStatusAction} className="mt-5 space-y-3">
              <input type="hidden" name="leadId" value={lead.id} />
              <select name="status" defaultValue={lead.status} className="w-full rounded-xl border border-white/10 bg-[#101522] px-3 py-3 text-sm text-white">
                {Object.values(LeadStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <button className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-black hover:bg-primary-hover">
                Update status
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="font-semibold text-white">Contact</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="text-white/35">Email</dt>
                <dd className="mt-1 text-white/70">{lead.email}</dd>
              </div>
              <div>
                <dt className="text-white/35">Phone</dt>
                <dd className="mt-1 text-white/70">{lead.phone}</dd>
              </div>
              <div>
                <dt className="text-white/35">Company</dt>
                <dd className="mt-1 text-white/70">{lead.company || 'Not provided'}</dd>
              </div>
              <div>
                <dt className="text-white/35">Budget</dt>
                <dd className="mt-1 text-white/70">{lead.budgetRange}</dd>
              </div>
              <div>
                <dt className="text-white/35">Timeline</dt>
                <dd className="mt-1 text-white/70">{lead.timeline}</dd>
              </div>
            </dl>
            <div className="mt-6 grid grid-cols-1 gap-3">
              <a href={`mailto:${lead.email}`} className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm text-white/60 hover:text-white">
                Email lead
              </a>
              <a href={getWhatsAppHref(lead.phone, lead.name)} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-black hover:bg-primary-hover">
                Open WhatsApp
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="font-semibold text-white">Email delivery</h2>
            <div className="mt-5 space-y-3">
              {lead.emailDeliveries.length === 0 ? (
                <p className="text-sm text-white/40">No email attempts logged.</p>
              ) : (
                lead.emailDeliveries.map((delivery) => (
                  <div key={delivery.id} className="rounded-xl border border-white/10 p-3">
                    <p className="text-sm text-white/65">{delivery.provider} · {delivery.status}</p>
                    {delivery.error && <p className="mt-1 text-xs text-rose-200">{delivery.error}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
