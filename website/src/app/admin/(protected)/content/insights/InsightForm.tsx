import { ContentStatus, SeoIndustry, ServiceInterest, type InsightPost } from '@prisma/client';
import { AdminField, adminInputClass, adminSelectClass, AdminSubmitButton } from '@/components/admin/AdminForm';
import { saveInsightPostAction } from '../actions';

export function InsightForm({ post }: { post?: InsightPost | null }) {
  return (
    <form action={saveInsightPostAction} className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      {post && <input type="hidden" name="id" value={post.id} />}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <AdminField label="Title">
          <input name="title" required defaultValue={post?.title ?? ''} className={adminInputClass} />
        </AdminField>
        <AdminField label="Slug">
          <input name="slug" required defaultValue={post?.slug ?? ''} className={adminInputClass} />
        </AdminField>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
        <AdminField label="Author">
          <input name="author" required defaultValue={post?.author ?? 'Pranshu Dixit'} className={adminInputClass} />
        </AdminField>
        <AdminField label="Niche">
          <select name="niche" defaultValue={post?.niche ?? ServiceInterest.HEALTHCARE} className={adminSelectClass}>
            {Object.values(ServiceInterest).map((niche) => (
              <option key={niche} value={niche}>{niche}</option>
            ))}
          </select>
        </AdminField>
        <AdminField label="Status">
          <select name="status" defaultValue={post?.status ?? ContentStatus.DRAFT} className={adminSelectClass}>
            {Object.values(ContentStatus).map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </AdminField>
        <AdminField label="Tags">
          <input name="tags" defaultValue={post?.tags.join(', ') ?? ''} className={adminInputClass} />
        </AdminField>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <AdminField label="Meta title">
          <input name="metaTitle" defaultValue={post?.metaTitle ?? ''} className={adminInputClass} />
        </AdminField>
        <AdminField label="Meta description">
          <textarea name="metaDescription" rows={3} defaultValue={post?.metaDescription ?? ''} className={adminInputClass} />
        </AdminField>
      </div>

      <AdminField label="Excerpt">
        <textarea name="excerpt" required rows={4} defaultValue={post?.excerpt ?? ''} className={adminInputClass} />
      </AdminField>

      <AdminField label="Body" hint="Use plain markdown-style headings and paragraphs. Keep first-hand proof and direct answers near the top.">
        <textarea name="body" required rows={18} defaultValue={post?.body ?? ''} className={`${adminInputClass} font-mono text-xs leading-6`} />
      </AdminField>

      <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
        <h2 className="mb-5 font-semibold text-white">Advanced SEO</h2>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <AdminField label="SEO industry">
            <select name="seoIndustry" defaultValue={post?.seoIndustry ?? SeoIndustry.GENERAL} className={adminSelectClass}>
              {Object.values(SeoIndustry).map((industry) => <option key={industry} value={industry}>{industry}</option>)}
            </select>
          </AdminField>
          <AdminField label="Search intent">
            <input name="seoSearchIntent" defaultValue={post?.seoSearchIntent ?? ''} className={adminInputClass} />
          </AdminField>
          <AdminField label="Funnel stage">
            <input name="seoFunnelStage" defaultValue={post?.seoFunnelStage ?? ''} className={adminInputClass} />
          </AdminField>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <AdminField label="Primary keyword">
            <input name="seoPrimaryKeyword" defaultValue={post?.seoPrimaryKeyword ?? ''} className={adminInputClass} />
          </AdminField>
          <AdminField label="Secondary keywords" hint="Comma separated.">
            <input name="seoSecondaryKeywords" defaultValue={post?.seoSecondaryKeywords.join(', ') ?? ''} className={adminInputClass} />
          </AdminField>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <AdminField label="Canonical path">
            <input name="canonicalPath" defaultValue={post?.canonicalPath ?? ''} className={adminInputClass} />
          </AdminField>
          <AdminField label="Internal link targets" hint="One path per line.">
            <textarea name="internalLinkTargets" rows={4} defaultValue={post?.internalLinkTargets.join('\n') ?? ''} className={adminInputClass} />
          </AdminField>
        </div>
      </div>

      <AdminSubmitButton />
    </form>
  );
}
