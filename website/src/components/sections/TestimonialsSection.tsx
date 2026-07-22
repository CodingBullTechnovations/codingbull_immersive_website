import { getPublishedTestimonials } from '@/lib/server/public-content';
import { Reveal } from '@/components/animations/Reveal';

interface TestimonialsSectionProps {
  kicker?: string;
}

/**
 * Attributed client signals, CMS-first: renders only PUBLISHED + APPROVED
 * testimonials from the admin panel. Renders nothing when none exist —
 * no anonymous or invented social proof, per the content rules.
 */
export async function TestimonialsSection({ kicker = 'Client signals' }: TestimonialsSectionProps) {
  const testimonials = await getPublishedTestimonials();
  if (testimonials.length === 0) return null;

  return (
    <section className="cb-section border-t border-white/[0.08] bg-[#05070a]" aria-labelledby="testimonials-title">
      <div className="cb-shell">
        <Reveal className="border-b border-white/10 pb-12">
          <p className="cb-kicker">{kicker}</p>
          <h2 id="testimonials-title" className="cb-display mt-6 max-w-[13ch]">
            What operators say after launch.
          </h2>
        </Reveal>

        <Reveal mode="group" className="grid gap-px border-l border-white/10 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <figure
              key={testimonial.id}
              data-reveal=""
              style={{ ['--reveal-delay' as string]: `${index * 0.08}s` }}
              className="flex flex-col justify-between border-b border-r border-white/10 bg-white/[0.008] p-7 sm:p-9"
            >
              <blockquote className="text-pretty text-base leading-7 text-white/70">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-8 border-t border-white/10 pt-5">
                <p className="text-sm font-semibold text-white">{testimonial.person}</p>
                <p className="cb-mono mt-1 text-xs uppercase tracking-[0.16em] text-white/40">
                  {[testimonial.role, testimonial.company].filter(Boolean).join(' · ')}
                </p>
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
