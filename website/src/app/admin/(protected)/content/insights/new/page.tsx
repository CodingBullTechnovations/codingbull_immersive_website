import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { InsightForm } from '../InsightForm';

export default function NewInsightPage() {
  return (
    <>
      <AdminPageHeader title="New Insight" description="Create an experience-backed article that can support SEO and AI citations." />
      <InsightForm />
    </>
  );
}
