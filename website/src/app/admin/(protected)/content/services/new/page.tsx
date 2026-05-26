import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ServiceForm } from '../ServiceForm';

export default function NewServicePage() {
  return (
    <>
      <AdminPageHeader title="New Service Page" description="Create a crawlable, conversion-focused service hub." />
      <ServiceForm />
    </>
  );
}
