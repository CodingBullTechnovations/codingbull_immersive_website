import { ContentStatus, PermissionStatus, SeoIndustry, type CaseStudy } from '@prisma/client';
import { AdminField, adminInputClass, adminSelectClass, AdminSubmitButton } from '@/components/admin/AdminForm';
import { saveCaseStudyAction } from '../actions';

function pairValue(value: unknown, leftKey: string, rightKey: string) {
  if (!Array.isArray(value)) return '';
  return value
    .map((item) => {
      if (typeof item !== 'object' || item === null) return '';
      const record = item as Record<string, unknown>;
      return `${String(record[leftKey] ?? '')} | ${String(record[rightKey] ?? '')}`.trim();
    })
    .filter(Boolean)
    .join('\n');
}

export function CaseStudyForm({ study }: { study?: CaseStudy | null }) {
  return (
    <form action={saveCaseStudyAction} className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      {study && <input type="hidden" name="id" value={study.id} />}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <AdminField label="Client">
          <input name="client" required defaultValue={study?.client ?? ''} className={adminInputClass} />
        </AdminField>
        <AdminField label="Slug">
          <input name="slug" required defaultValue={study?.slug ?? ''} className={adminInputClass} />
        </AdminField>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <AdminField label="Title">
          <input name="title" required defaultValue={study?.title ?? ''} className={adminInputClass} />
        </AdminField>
        <AdminField label="Industry">
          <input name="industry" required defaultValue={study?.industry ?? ''} className={adminInputClass} />
        </AdminField>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <AdminField label="Status">
          <select name="status" defaultValue={study?.status ?? ContentStatus.DRAFT} className={adminSelectClass}>
            {Object.values(ContentStatus).map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </AdminField>
        <AdminField label="Permission status">
          <select name="permissionStatus" defaultValue={study?.permissionStatus ?? PermissionStatus.UNKNOWN} className={adminSelectClass}>
            {Object.values(PermissionStatus).map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </AdminField>
      </div>

      <AdminField label="Problem">
        <textarea name="problem" required rows={5} defaultValue={study?.problem ?? ''} className={adminInputClass} />
      </AdminField>
      <AdminField label="Constraints">
        <textarea name="constraints" rows={4} defaultValue={study?.constraints ?? ''} className={adminInputClass} />
      </AdminField>
      <AdminField label="Solution">
        <textarea name="solution" required rows={5} defaultValue={study?.solution ?? ''} className={adminInputClass} />
      </AdminField>
      <AdminField label="Outcomes">
        <textarea name="outcomes" required rows={5} defaultValue={study?.outcomes ?? ''} className={adminInputClass} />
      </AdminField>
      <AdminField label="Architecture" hint="One per line: Title | Description">
        <textarea name="architecture" rows={6} defaultValue={pairValue(study?.architecture, 'title', 'description')} className={adminInputClass} />
      </AdminField>
      <AdminField label="Metrics" hint="One per line: Label | Value">
        <textarea name="metrics" rows={5} defaultValue={pairValue(study?.metrics, 'label', 'value')} className={adminInputClass} />
      </AdminField>

      <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
        <h2 className="mb-5 font-semibold text-white">Advanced SEO</h2>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <AdminField label="SEO industry">
            <select name="seoIndustry" defaultValue={study?.seoIndustry ?? SeoIndustry.GENERAL} className={adminSelectClass}>
              {Object.values(SeoIndustry).map((industry) => <option key={industry} value={industry}>{industry}</option>)}
            </select>
          </AdminField>
          <AdminField label="Search intent">
            <input name="seoSearchIntent" defaultValue={study?.seoSearchIntent ?? ''} className={adminInputClass} />
          </AdminField>
          <AdminField label="Funnel stage">
            <input name="seoFunnelStage" defaultValue={study?.seoFunnelStage ?? ''} className={adminInputClass} />
          </AdminField>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <AdminField label="Primary keyword">
            <input name="seoPrimaryKeyword" defaultValue={study?.seoPrimaryKeyword ?? ''} className={adminInputClass} />
          </AdminField>
          <AdminField label="Secondary keywords" hint="Comma separated.">
            <input name="seoSecondaryKeywords" defaultValue={study?.seoSecondaryKeywords.join(', ') ?? ''} className={adminInputClass} />
          </AdminField>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <AdminField label="Canonical path">
            <input name="canonicalPath" defaultValue={study?.canonicalPath ?? ''} className={adminInputClass} />
          </AdminField>
          <AdminField label="Internal link targets" hint="One path per line.">
            <textarea name="internalLinkTargets" rows={4} defaultValue={study?.internalLinkTargets.join('\n') ?? ''} className={adminInputClass} />
          </AdminField>
        </div>
      </div>

      <AdminSubmitButton />
    </form>
  );
}
