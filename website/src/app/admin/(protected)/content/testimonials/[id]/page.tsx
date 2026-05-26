import { notFound } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { getTestimonialAdmin } from '@/lib/server/cms';
import { TestimonialForm } from '../TestimonialForm';

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const testimonial = await getTestimonialAdmin(id);
  if (!testimonial) notFound();

  return (
    <>
      <AdminPageHeader title={testimonial.person} description="Edit quote, permission status, and display order." />
      <TestimonialForm testimonial={testimonial} />
    </>
  );
}
