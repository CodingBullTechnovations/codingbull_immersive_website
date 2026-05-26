import { notFound } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { getCaseStudyAdmin } from '@/lib/server/cms';
import { CaseStudyForm } from '../CaseStudyForm';

export default async function EditCaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const study = await getCaseStudyAdmin(id);
  if (!study) notFound();

  return (
    <>
      <AdminPageHeader title={study.client} description="Edit proof, permission status, and publishing details." />
      <CaseStudyForm study={study} />
    </>
  );
}
