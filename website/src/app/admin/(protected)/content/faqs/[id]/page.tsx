import { notFound } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { getFaqAdmin } from '@/lib/server/cms';
import { FaqForm } from '../FaqForm';

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const faq = await getFaqAdmin(id);
  if (!faq) notFound();

  return (
    <>
      <AdminPageHeader title="Edit FAQ" description="Edit answer content, mapping, status, and ordering." />
      <FaqForm faq={faq} />
    </>
  );
}
