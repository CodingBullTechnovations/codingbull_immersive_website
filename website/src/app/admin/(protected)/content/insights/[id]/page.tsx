import { notFound } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { getInsightPostAdmin } from '@/lib/server/cms';
import { InsightForm } from '../InsightForm';

export default async function EditInsightPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getInsightPostAdmin(id);
  if (!post) notFound();

  return (
    <>
      <AdminPageHeader title={post.title} description="Edit article copy, metadata, tags, and publishing status." />
      <InsightForm post={post} />
    </>
  );
}
