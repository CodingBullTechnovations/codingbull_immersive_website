import { AdminField, adminInputClass, adminSelectClass, AdminSubmitButton } from '@/components/admin/AdminForm';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { listMediaAdmin } from '@/lib/server/cms';
import { deleteMediaAssetAction, saveMediaAssetAction } from './actions';

export default async function AdminMediaPage() {
  const media = await listMediaAdmin();

  return (
    <>
      <AdminPageHeader
        title="Media"
        description="Register approved media assets with alt text and usage context before adding them to pages."
      />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form action={saveMediaAssetAction} className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <AdminField label="File name">
            <input name="fileName" required className={adminInputClass} />
          </AdminField>
          <AdminField label="URL">
            <input name="url" required placeholder="https://..." className={adminInputClass} />
          </AdminField>
          <AdminField label="Alt text">
            <textarea name="altText" required rows={3} className={adminInputClass} />
          </AdminField>
          <AdminField label="MIME type">
            <select name="mimeType" className={adminSelectClass} defaultValue="image/png">
              <option value="image/png">image/png</option>
              <option value="image/jpeg">image/jpeg</option>
              <option value="image/webp">image/webp</option>
              <option value="video/mp4">video/mp4</option>
            </select>
          </AdminField>
          <AdminField label="Usage">
            <input name="usage" placeholder="homepage hero, healthcare service, case study" className={adminInputClass} />
          </AdminField>
          <AdminSubmitButton label="Register media" />
        </form>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
          {media.length === 0 ? (
            <p className="px-5 py-10 text-sm text-white/45">No media assets registered yet.</p>
          ) : (
            <div className="divide-y divide-white/10">
              {media.map((item) => (
                <div key={item.id} className="px-5 py-4">
                  <p className="font-semibold text-white">{item.fileName}</p>
                  <p className="mt-1 break-all text-xs text-white/40">{item.url}</p>
                  <p className="mt-2 text-sm text-white/55">{item.altText}</p>
                  <form action={deleteMediaAssetAction} className="mt-3 flex flex-wrap gap-2">
                    <input type="hidden" name="id" value={item.id} />
                    <input name="confirmation" placeholder="Type DELETE" className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-white outline-none placeholder:text-white/25" />
                    <button className="rounded-lg border border-red-400/25 px-3 py-2 text-xs font-semibold text-red-100 hover:bg-red-400/10">Delete record</button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
