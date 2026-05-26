import { notFound } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { getServicePage } from '@/lib/server/cms';
import { ServiceForm } from '../ServiceForm';

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await getServicePage(id);
  if (!service) notFound();

  return (
    <>
      <AdminPageHeader title={service.title} description="Edit service positioning, schema-supporting facts, modules, and FAQ content." />
      <ServiceForm service={service} />
    </>
  );
}
