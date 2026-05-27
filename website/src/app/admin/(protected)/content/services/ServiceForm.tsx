import { ContentStatus, SeoIndustry, ServiceInterest, type ServicePage } from '@prisma/client';
import { AdminField, adminInputClass, adminSelectClass, AdminSubmitButton } from '@/components/admin/AdminForm';
import { saveServicePageAction } from '../actions';

function listValue(value: unknown) {
  return Array.isArray(value) ? value.join('\n') : '';
}

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

export function ServiceForm({ service }: { service?: ServicePage | null }) {
  const hero = typeof service?.hero === 'object' && service.hero !== null ? (service.hero as Record<string, unknown>) : {};

  return (
    <form action={saveServicePageAction} className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      {service && <input type="hidden" name="id" value={service.id} />}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <AdminField label="Title">
          <input name="title" required defaultValue={service?.title ?? ''} className={adminInputClass} />
        </AdminField>
        <AdminField label="Slug" hint="Lowercase letters, numbers, and hyphens.">
          <input name="slug" required defaultValue={service?.slug ?? ''} className={adminInputClass} />
        </AdminField>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <AdminField label="Niche">
          <select name="niche" defaultValue={service?.niche ?? ServiceInterest.HEALTHCARE} className={adminSelectClass}>
            {Object.values(ServiceInterest).map((niche) => (
              <option key={niche} value={niche}>
                {niche}
              </option>
            ))}
          </select>
        </AdminField>
        <AdminField label="Status">
          <select name="status" defaultValue={service?.status ?? ContentStatus.DRAFT} className={adminSelectClass}>
            {Object.values(ContentStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </AdminField>
        <AdminField label="Meta title">
          <input name="metaTitle" defaultValue={service?.metaTitle ?? ''} className={adminInputClass} />
        </AdminField>
      </div>

      <AdminField label="Meta description">
        <textarea name="metaDescription" rows={3} defaultValue={service?.metaDescription ?? ''} className={adminInputClass} />
      </AdminField>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <AdminField label="Hero headline">
          <input name="heroHeadline" defaultValue={String(hero.headline ?? '')} className={adminInputClass} />
        </AdminField>
        <AdminField label="Hero summary">
          <textarea name="heroSummary" rows={4} defaultValue={String(hero.summary ?? '')} className={adminInputClass} />
        </AdminField>
      </div>

      <AdminField label="Pain points" hint="One buyer pain point per line.">
        <textarea name="painPoints" rows={6} defaultValue={listValue(service?.painPoints)} className={adminInputClass} />
      </AdminField>

      <AdminField label="Modules" hint="One per line: Title | Description">
        <textarea name="modules" rows={6} defaultValue={pairValue(service?.modules, 'title', 'description')} className={adminInputClass} />
      </AdminField>

      <AdminField label="FAQs" hint="One per line: Question | Answer">
        <textarea name="faqs" rows={6} defaultValue={pairValue(service?.faqs, 'question', 'answer')} className={adminInputClass} />
      </AdminField>

      <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
        <h2 className="mb-5 font-semibold text-white">Advanced SEO</h2>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <AdminField label="SEO industry">
            <select name="seoIndustry" defaultValue={service?.seoIndustry ?? SeoIndustry.GENERAL} className={adminSelectClass}>
              {Object.values(SeoIndustry).map((industry) => <option key={industry} value={industry}>{industry}</option>)}
            </select>
          </AdminField>
          <AdminField label="Search intent">
            <input name="seoSearchIntent" defaultValue={service?.seoSearchIntent ?? ''} className={adminInputClass} />
          </AdminField>
          <AdminField label="Funnel stage">
            <input name="seoFunnelStage" defaultValue={service?.seoFunnelStage ?? ''} className={adminInputClass} />
          </AdminField>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <AdminField label="Primary keyword">
            <input name="seoPrimaryKeyword" defaultValue={service?.seoPrimaryKeyword ?? ''} className={adminInputClass} />
          </AdminField>
          <AdminField label="Secondary keywords" hint="Comma separated.">
            <input name="seoSecondaryKeywords" defaultValue={service?.seoSecondaryKeywords.join(', ') ?? ''} className={adminInputClass} />
          </AdminField>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <AdminField label="Canonical path">
            <input name="canonicalPath" defaultValue={service?.canonicalPath ?? ''} className={adminInputClass} />
          </AdminField>
          <AdminField label="Internal link targets" hint="One path per line.">
            <textarea name="internalLinkTargets" rows={4} defaultValue={listValue(service?.internalLinkTargets)} className={adminInputClass} />
          </AdminField>
        </div>
      </div>

      <AdminSubmitButton />
    </form>
  );
}
