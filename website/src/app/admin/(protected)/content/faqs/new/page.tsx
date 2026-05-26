import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { FaqForm } from '../FaqForm';

export default function NewFaqPage() {
  return (
    <>
      <AdminPageHeader title="New FAQ" description="Create a direct answer that supports conversion and structured data." />
      <FaqForm />
    </>
  );
}
