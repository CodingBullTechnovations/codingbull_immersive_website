import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { TestimonialForm } from '../TestimonialForm';

export default function NewTestimonialPage() {
  return (
    <>
      <AdminPageHeader title="New Testimonial" description="Add a quote only when usage permission is known or being tracked." />
      <TestimonialForm />
    </>
  );
}
