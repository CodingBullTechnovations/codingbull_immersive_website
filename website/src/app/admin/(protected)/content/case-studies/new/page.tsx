import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { CaseStudyForm } from '../CaseStudyForm';

export default function NewCaseStudyPage() {
  return (
    <>
      <AdminPageHeader title="New Case Study" description="Create a proof asset that is useful for buyers and AI/search citations." />
      <CaseStudyForm />
    </>
  );
}
